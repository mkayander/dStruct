import type { DialogProps } from "@mui/material/Dialog/Dialog";
import TextField from "@mui/material/TextField";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import * as yup from "yup";

import { usePlaygroundSlugs } from "#/hooks";
import { EditFormModal } from "#/layouts/modals/EditFormModal";
import { useAppSelector } from "#/store/hooks";
import { selectProjectId } from "#/store/reducers/projectReducer";
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
    .matches(/^[a-zA-Z](-?[a-zA-Z0-9])*$/, "Must be a valid URL slug"),
  caseDescription: yup
    .string()
    .max(190, "Case description must be at most 200 characters"),
});

export type CaseModalProps = DialogProps & {
  onClose: () => void;
};

export const CaseModal: React.FC<CaseModalProps> = ({ onClose, ...props }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { projectSlug = "", caseSlug = "", setCase } = usePlaygroundSlugs();

  const currentProjectId = useAppSelector(selectProjectId) || "";

  const invalidateQueries = async () => {
    await trpcUtils.project.getBySlug.invalidate(projectSlug);
  };

  const currentCase = trpc.project.getCaseBySlug.useQuery(
    { projectId: currentProjectId, slug: caseSlug },
    { enabled: Boolean(currentProjectId && caseSlug) }
  );

  const trpcUtils = trpc.useContext();

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
      invalidateQueries();

      onClose();

      enqueueSnackbar(
        `🧪 Test case "${data.title}" was successfully updated 📝`,
        { variant: "success" }
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
        }
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
        `Are you sure you want to delete the "${currentCase.data.title}" test case? This action cannot be undone.`
      ) // TODO: Replace with a custom modal
    )
      return;

    await deleteCase.mutateAsync({
      projectId: currentCase.data.projectId,
      caseId: currentCase.data.id,
    });
  };

  return (
    <EditFormModal
      formik={formik}
      title="🧪 Edit Test Case"
      summary="Edit the details of your test case."
      isDeleting={deleteCase.isLoading}
      onClose={onClose}
      onDelete={handleCaseDelete}
      fullWidth
      {...props}
    >
      <TextField
        id="caseSlug"
        name="caseSlug"
        label="Slug"
        variant="outlined"
        disabled={formik.isSubmitting}
        value={formik.values.caseSlug}
        onChange={formik.handleChange}
        error={formik.touched.caseSlug && Boolean(formik.errors.caseSlug)}
        helperText={
          (formik.touched.caseSlug && formik.errors.caseSlug) ||
          "You can edit a slug that's used in the URL to this test case."
        }
      />
      <TextField
        id="caseName"
        name="caseName"
        label="Name"
        variant="outlined"
        required
        disabled={formik.isSubmitting}
        value={formik.values.caseName}
        onChange={formik.handleChange}
        error={formik.touched.caseName && Boolean(formik.errors.caseName)}
        helperText={
          (formik.touched.caseName && formik.errors.caseName) ||
          "The name of your test case."
        }
      />
      <TextField
        id="caseDescription"
        name="caseDescription"
        label="Description"
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
          "Optional test case description."
        }
      />
    </EditFormModal>
  );
};
