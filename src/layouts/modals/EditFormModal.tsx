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
import type { useFormik } from "formik";
import React from "react";

export type EditModalProps = DialogProps & {
  title: string;
  summary: string;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
  formik: ReturnType<typeof useFormik<any>>;
  children: React.ReactNode;
};

export const EditFormModal: React.FC<EditModalProps> = ({
  title,
  summary,
  isDeleting,
  onClose,
  onDelete,
  formik,
  children,
  ...props
}) => {
  return (
    <Dialog {...props} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{summary}</DialogContentText>
          <Stack spacing={2} mt={2}>
            {children}
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            title="Delete this project"
            color="error"
            endIcon={<DeleteForever />}
            loading={isDeleting}
            loadingPosition="end"
            onClick={onDelete}
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
