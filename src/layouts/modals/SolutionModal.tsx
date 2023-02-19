import type { DialogProps } from "@mui/material/Dialog/Dialog";
import TextField from "@mui/material/TextField";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import * as yup from "yup";

import { usePlaygroundSlugs } from "#/hooks";
import { EditFormModal } from "#/layouts/modals/EditFormModal";
import { trpc } from "#/utils";

const validationSchema = yup.object({
  solutionName: yup
    .string()
    .min(3, "Solution name must be at least 3 characters")
    .max(190, "Solution name must be at most 50 characters")
    .required("Solution name is required"),
  solutionDescription: yup
    .string()
    .max(190, "Solution description must be at most 200 characters"),
});

export type SolutionModalProps = DialogProps & {
  onClose: () => void;
};

export const SolutionModal: React.FC<SolutionModalProps> = ({
  onClose,
  ...props
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    projectSlug = "",
    solutionSlug = "",
    setSolution,
  } = usePlaygroundSlugs();

  const invalidateQueries = () => {
    void trpcUtils.project.getBySlug.invalidate(projectSlug);
  };

  const currentSolution = trpc.project.getSolutionBySlug.useQuery(
    { slug: solutionSlug },
    { enabled: Boolean(solutionSlug && projectSlug) }
  );

  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      solutionName: "",
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
          description: values.solutionDescription,
        });
      } catch (error: any) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            solutionName: error.message,
          });
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      }
    },
  });

  const editSolution = trpc.project.updateSolution.useMutation({
    onSuccess: (data) => {
      invalidateQueries();

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

  return (
    <EditFormModal
      formik={formik}
      title="🚀 Edit Solution"
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
        label="Name"
        variant="outlined"
        required
        disabled={formik.isSubmitting}
        value={formik.values.solutionName}
        onChange={formik.handleChange}
        error={
          formik.touched.solutionName && Boolean(formik.errors.solutionName)
        }
        helperText={
          (formik.touched.solutionName && formik.errors.solutionName) ||
          "The name of your solution."
        }
      />
      <TextField
        id="solutionDescription"
        name="solutionDescription"
        label="Description"
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
