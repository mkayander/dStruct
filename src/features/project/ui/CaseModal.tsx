import type { DialogProps } from "@mui/material/Dialog/Dialog";
import TextField from "@mui/material/TextField";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import slugify from "slugify";
import * as yup from "yup";

import { selectProjectId } from "#/features/project/model/projectSlice";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { EditFormModal } from "#/shared/ui/organisms/EditFormModal";
import { useAppSelector } from "#/store/hooks";
import { trpc } from "#/utils";

const validationSchema = yup.object({
  caseName: yup
    .string()
    .min(3, "Case name must be at least 3 characters")
    .max(190, "Case name must be at most 50 characters")
    .required("Case name is required"),
  caseSlug: yup
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be at most 100 characters")
    .matches(/^[a-zA-Z0-9](-?[a-zA-Z0-9])*$/, "Must be a valid URL slug"),
  caseDescription: yup
    .string()
    .max(190, "Case description must be at most 200 characters"),
});

export type CaseModalProps = DialogProps & {
  onClose: () => void;
};

export const CaseModal: React.FC<CaseModalProps> = ({ onClose, ...props }) => {
  const { LL } = useI18nContext();
  const { enqueueSnackbar } = useSnackbar();
  const { projectSlug = "", caseSlug = "", setCase } = usePlaygroundSlugs();

  const currentProjectId = useAppSelector(selectProjectId) || "";

  const invalidateQueries = async () => {
    await trpcUtils.project.getBySlug.invalidate(projectSlug);
  };

  const currentCase = trpc.project.getCaseBySlug.useQuery(
    { projectId: currentProjectId, slug: caseSlug },
    { enabled: Boolean(currentProjectId && caseSlug) },
  );

  const trpcUtils = trpc.useUtils();

  const formik = useFormik({
    initialValues: {
      caseName: "",
      caseSlug: "",
      caseDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      if (!currentCase.data) return;

      try {
        await editCase.mutateAsync({
          projectId: currentCase.data.projectId,
          caseId: currentCase.data.id,
          title: values.caseName,
          slug: values.caseSlug,
          description: values.caseDescription,
        });
        void setCase(values.caseSlug);
      } catch (error: unknown) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            caseName: error.message,
          });
        } else if (error instanceof Error) {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Unknown error", {
            variant: "error",
          });
          console.error(error);
        }
      }
    },
  });

  const editCase = trpc.project.updateCase.useMutation({
    onSuccess: (data) => {
      void invalidateQueries();

      onClose();

      enqueueSnackbar(
        `🧪 Test case "${data.title}" was successfully updated 📝`,
        { variant: "success" },
      );
    },
  });
  const deleteCase = trpc.project.deleteCase.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries();
      void setCase("");

      onClose();
      formik.resetForm();
      enqueueSnackbar(
        `🧪 Test case "${data.title}" was successfully deleted 🧹`,
        {
          variant: "success",
        },
      );
    },
  });

  useEffect(() => {
    if (currentCase.data) {
      formik.setValues({
        caseName: currentCase.data.title,
        caseSlug: currentCase.data.slug,
        caseDescription: currentCase.data.description ?? "",
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCase.data]);

  const handleCaseDelete = async () => {
    if (!currentCase.data) return;
    if (
      !confirm(
        `Are you sure you want to delete the "${currentCase.data.title}" test case? This action cannot be undone.`,
      ) // TODO: Replace with a custom modal
    )
      return;

    await deleteCase.mutateAsync({
      projectId: currentCase.data.projectId,
      caseId: currentCase.data.id,
    });
  };

  const handleGenerateSlug = (value?: string) => {
    formik.setFieldValue(
      "caseSlug",
      slugify(value ?? formik.values.caseName, {
        lower: true,
        strict: true,
      }),
    );
  };

  return (
    <EditFormModal
      formik={formik}
      title={`🧪 ${LL.EDIT_TEST_CASE()}`}
      summary={LL.EDIT_TEST_CASE_SUMMARY()}
      isDeleting={deleteCase.isLoading}
      onClose={onClose}
      onDelete={handleCaseDelete}
      fullWidth
      {...props}
    >
      <TextField
        id="caseName"
        name="caseName"
        label={LL.NAME()}
        variant="outlined"
        required
        disabled={formik.isSubmitting}
        value={formik.values.caseName}
        onChange={(ev) => {
          formik.handleChange(ev);
          if (!formik.touched.caseSlug) {
            handleGenerateSlug(ev.target.value);
          }
        }}
        error={formik.touched.caseName && Boolean(formik.errors.caseName)}
        helperText={
          (formik.touched.caseName && formik.errors.caseName) ||
          LL.TEST_CASE_NAME_HELPER_TEXT()
        }
      />
      <TextField
        id="caseSlug"
        name="caseSlug"
        label={LL.SLUG()}
        variant="outlined"
        disabled={formik.isSubmitting}
        value={formik.values.caseSlug}
        onChange={formik.handleChange}
        error={formik.touched.caseSlug && Boolean(formik.errors.caseSlug)}
        helperText={
          (formik.touched.caseSlug && formik.errors.caseSlug) ||
          // "You can edit a slug that's used in the URL to this test case."
          LL.TEST_CASE_SLUG_HELPER_TEXT()
        }
      />
      <TextField
        id="caseDescription"
        name="caseDescription"
        label={LL.DESCRIPTION()}
        variant="outlined"
        multiline
        minRows={2}
        maxRows={8}
        disabled={formik.isSubmitting}
        value={formik.values.caseDescription}
        onChange={formik.handleChange}
        error={
          formik.touched.caseDescription &&
          Boolean(formik.errors.caseDescription)
        }
        helperText={
          (formik.touched.caseDescription && formik.errors.caseDescription) ||
          // "Optional test case description."
          LL.TEST_CASE_DESCRIPTION_HELPER_TEXT()
        }
      />
    </EditFormModal>
  );
};
