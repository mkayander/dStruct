import { DeleteForever } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import type { DialogProps } from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { type PlaygroundTestCase } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import * as yup from "yup";

import { trpc } from "#/utils";

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

type CaseModalProps = DialogProps & {
  onClose: () => void;
  currentCase?: PlaygroundTestCase;
  onCaseUpdate: (
    data: Pick<PlaygroundTestCase, "id" | "title" | "description">
  ) => void;
  onCaseDelete: (caseId: string) => void;
};

export const CaseModal: React.FC<CaseModalProps> = ({
  onClose,
  currentCase,
  onCaseDelete,
  ...props
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const editCase = trpc.project.updateCase.useMutation();
  const deleteCase = trpc.project.deleteCase.useMutation();
  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      caseName: "",
      caseDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      if (!currentCase) return;
      try {
        await editCase.mutateAsync({
          projectId: currentCase.projectId,
          caseId: currentCase.id,
          title: values.caseName,
          description: values.caseDescription,
        });

        void trpcUtils.project.getById.invalidate(currentCase.projectId);
        void trpcUtils.project.getCaseById.invalidate({
          id: currentCase.id,
          projectId: currentCase.projectId,
        });

        onClose();
        formikHelpers.resetForm();

        enqueueSnackbar(
          `Test case "${values.caseName}" was successfully updated 📝`,
          {
            variant: "success",
          }
        );
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

  useEffect(() => {
    if (currentCase) {
      formik.setValues({
        caseName: currentCase.title,
        caseDescription: currentCase.description ?? "",
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCase]);

  // const handleDeleteProject = async () => {
  //   if (!currentCase) return;
  //   if (
  //     !confirm(
  //       `Are you sure you want to delete the "${currentCase.title}" project? This action cannot be undone.`
  //     ) // TODO: Replace with a custom modal
  //   )
  //     return;
  //
  //   await deleteCase.mutateAsync({
  //     projectId: currentCase.projectId,
  //     caseId: currentCase.id,
  //   });
  //   dispatch(projectSlice.actions.clear());
  //   void trpcUtils.project.allBrief.invalidate();
  //   onClose();
  //   formik.resetForm();
  //
  //   enqueueSnackbar(
  //     `Project "${currentCase.title}" was successfully deleted 🧹`,
  //     {
  //       variant: "success",
  //     }
  //   );
  // };

  const handleCaseDelete = async () => {
    if (!currentCase) return;
    onCaseDelete(currentCase.id);
  };

  return (
    <Dialog {...props} onClose={onClose}>
      <form
        onSubmit={(e) => {
          console.log("submit");
          formik.handleSubmit(e);
        }}
      >
        <DialogTitle>🧪 Edit Test Case</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the details of your test case.
          </DialogContentText>
          <Stack spacing={2} mt={2}>
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
                (formik.touched.caseDescription &&
                  formik.errors.caseDescription) ||
                "Optional test case description."
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            title="Delete this project"
            color="error"
            endIcon={<DeleteForever />}
            loading={deleteCase.isLoading}
            loadingPosition="end"
            onClick={handleCaseDelete}
            sx={{ mr: "auto" }}
          >
            Delete
          </LoadingButton>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" loading={formik.isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
