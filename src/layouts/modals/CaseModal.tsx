import type { DialogProps } from "@mui/material/Dialog/Dialog";
import TextField from "@mui/material/TextField";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { EditFormModal } from "#/layouts/modals/EditFormModal";
import { trpc } from "#/utils";

import { useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectCurrentCaseId,
  selectCurrentProjectId,
} from "#/store/reducers/projectReducer";

const validationSchema = yup.object({
  caseName: yup
    .string()
    .min(3, "Case name must be at least 3 characters")
    .max(190, "Case name must be at most 50 characters")
    .required("Case name is required"),
  caseDescription: yup
    .string()
    .max(190, "Case description must be at most 200 characters"),
});

export type CaseModalProps = DialogProps & {
  onClose: () => void;
};

export const CaseModal: React.FC<CaseModalProps> = ({ onClose, ...props }) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const currentProjectId = useAppSelector(selectCurrentProjectId) ?? "";
  const currentCaseId = useAppSelector(selectCurrentCaseId) ?? "";

  const invalidateQueries = () => {
    void trpcUtils.project.getById.invalidate(currentProjectId);
  };

  const currentCase = trpc.project.getCaseById.useQuery(
    { id: currentCaseId, projectId: currentProjectId },
    { enabled: Boolean(currentCaseId && currentProjectId) }
  );

  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      caseName: "",
      caseDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      if (!currentCase.data) return;

      try {
        await editCase.mutateAsync({
          projectId: currentProjectId,
          caseId: currentCase.data.id,
          title: values.caseName,
          description: values.caseDescription,
        });
      } catch (error: any) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            caseName: error.message,
          });
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
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
    onSuccess: (data) => {
      dispatch(projectSlice.actions.update({ currentCaseId: null }));
      invalidateQueries();

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
      projectId: currentProjectId,
      caseId: currentCaseId,
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
