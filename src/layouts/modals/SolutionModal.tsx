import type { DialogProps } from "@mui/material/Dialog/Dialog";
import TextField from "@mui/material/TextField";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import slugify from "slugify";
import * as yup from "yup";

import { usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { EditFormModal } from "#/layouts/modals/EditFormModal";
import { useAppSelector } from "#/store/hooks";
import { selectProjectId } from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";

const validationSchema = yup.object({
  solutionName: yup
    .string()
    .min(2, "Solution name must be at least 2 characters")
    .max(100, "Solution name must be at most 100 characters")
    .required("Solution name is required"),
  solutionSlug: yup
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .matches(/^[a-zA-Z](-?[a-zA-Z0-9])*$/, "Must be a valid URL slug"),
  solutionDescription: yup
    .string()
    .max(200, "Solution description must be at most 200 characters"),
});

export type SolutionModalProps = DialogProps & {
  onClose: () => void;
};

export const SolutionModal: React.FC<SolutionModalProps> = ({
  onClose,
  ...props
}) => {
  const { LL } = useI18nContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    projectSlug = "",
    solutionSlug = "",
    setSolution,
  } = usePlaygroundSlugs();

  const currentProjectId = useAppSelector(selectProjectId) || "";

  const invalidateQueries = () => {
    void trpcUtils.project.getBySlug.invalidate(projectSlug);
  };

  const currentSolution = trpc.project.getSolutionBySlug.useQuery(
    { projectId: currentProjectId, slug: solutionSlug },
    { enabled: Boolean(currentProjectId && solutionSlug) }
  );

  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      solutionName: "",
      solutionSlug: "",
      solutionDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      if (!currentSolution.data) return;

      try {
        await editSolution.mutateAsync({
          projectId: currentSolution.data.projectId,
          solutionId: currentSolution.data.id,
          title: values.solutionName,
          slug: values.solutionSlug,
          description: values.solutionDescription,
        });
      } catch (error: unknown) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            solutionName: error.message,
          });
        } else if (error instanceof Error) {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Something went wrong", {
            variant: "error",
          });
          console.error(error);
        }
      }
    },
  });

  const editSolution = trpc.project.updateSolution.useMutation({
    onSuccess: (data) => {
      invalidateQueries();
      void setSolution(data.slug);

      onClose();

      enqueueSnackbar(
        `🚀 Solution "${data.title}" was successfully updated 📝`,
        { variant: "success" }
      );
    },
  });
  const deleteSolution = trpc.project.deleteSolution.useMutation({
    onSuccess: (data) => {
      void setSolution("");
      invalidateQueries();

      onClose();
      formik.resetForm();
      enqueueSnackbar(
        `🚀 Solution "${data.title}" was successfully deleted 🧹`,
        {
          variant: "success",
        }
      );
    },
  });

  useEffect(() => {
    if (currentSolution.data) {
      formik.setValues({
        solutionName: currentSolution.data.title,
        solutionSlug: currentSolution.data.slug,
        solutionDescription: currentSolution.data.description ?? "",
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSolution.data]);

  const handleSolutionDelete = async () => {
    if (!currentSolution.data) return;
    if (
      !confirm(
        `Are you sure you want to delete the "${currentSolution.data.title}" test case? This action cannot be undone.`
      ) // TODO: Replace with a custom modal
    )
      return;

    await deleteSolution.mutateAsync({
      projectId: currentSolution.data.projectId,
      solutionId: currentSolution.data.id,
    });
  };

  const handleGenerateSlug = (value?: string) => {
    formik.setFieldValue(
      "solutionSlug",
      slugify(value ?? formik.values.solutionName, {
        lower: true,
        strict: true,
      })
    );
  };

  return (
    <EditFormModal
      formik={formik}
      title={`🚀 ${LL.EDIT_SOLUTION()}`}
      summary="Edit the details of your solution."
      isDeleting={deleteSolution.isLoading}
      onClose={onClose}
      onDelete={handleSolutionDelete}
      fullWidth
      {...props}
    >
      <TextField
        id="solutionName"
        name="solutionName"
        label={LL.NAME()}
        variant="outlined"
        required
        disabled={formik.isSubmitting}
        value={formik.values.solutionName}
        onChange={(ev) => {
          formik.handleChange(ev);
          if (!formik.touched.solutionSlug) {
            handleGenerateSlug(ev.target.value);
          }
        }}
        error={
          formik.touched.solutionName && Boolean(formik.errors.solutionName)
        }
        helperText={
          (formik.touched.solutionName && formik.errors.solutionName) ||
          "The name of your solution."
        }
      />
      <TextField
        id="solutionSlug"
        name="solutionSlug"
        label={LL.SLUG()}
        variant="outlined"
        disabled={formik.isSubmitting}
        value={formik.values.solutionSlug}
        onChange={formik.handleChange}
        error={
          formik.touched.solutionSlug && Boolean(formik.errors.solutionSlug)
        }
        helperText={
          (formik.touched.solutionSlug && formik.errors.solutionSlug) ||
          "You can edit a slug that's used in the URL to this solution."
        }
      />
      <TextField
        id="solutionDescription"
        name="solutionDescription"
        label={LL.DESCRIPTION()}
        variant="outlined"
        multiline
        minRows={2}
        maxRows={8}
        disabled={formik.isSubmitting}
        value={formik.values.solutionDescription}
        onChange={formik.handleChange}
        error={
          formik.touched.solutionDescription &&
          Boolean(formik.errors.solutionDescription)
        }
        helperText={
          (formik.touched.solutionDescription &&
            formik.errors.solutionDescription) ||
          "Optional solution description."
        }
      />
    </EditFormModal>
  );
};
