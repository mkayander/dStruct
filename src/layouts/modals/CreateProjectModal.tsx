import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ProjectCategory } from '@prisma/client';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import * as yup from 'yup';

import { trpc } from '#/utils';

const categoriesList = Object.values(ProjectCategory);
const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.BINARY_TREE]: 'Binary Tree',
  [ProjectCategory.ARRAY]: 'Array',
  [ProjectCategory.BST]: 'BST',
  [ProjectCategory.GRAPH]: 'Graph',
  [ProjectCategory.GRID]: 'Grid',
};

const validationSchema = yup.object({
  projectName: yup
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(50, 'Project name must be at most 50 characters')
    .required('Project name is required'),
  projectCategory: yup.string().required('Project category is required'),
});

type CreateProjectModalProps = DialogProps & {
  onClose: () => void;
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  ...props
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const submitProject = trpc.project.create.useMutation();
  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      projectName: '',
      projectCategory: '' as ProjectCategory,
      isPublic: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await submitProject.mutateAsync({
        title: values.projectName,
        category: values.projectCategory,
        isPublic: values.isPublic,
      });
      enqueueSnackbar('Project created successfully', {
        variant: 'success',
      });
      await trpcUtils.project.all.invalidate();
      onClose();
    },
  });

  return (
    <Dialog {...props} onClose={onClose}>
      <form
        onSubmit={(e) => {
          console.log('submit');
          formik.handleSubmit(e);
        }}
      >
        <DialogTitle>👷‍♂️ Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your new project. And other data.
          </DialogContentText>
          <Box display="flex" flexDirection="column" gap={1} mt={2}>
            <TextField
              id="projectName"
              name="projectName"
              label="Name"
              variant="outlined"
              required
              disabled={formik.isSubmitting}
              value={formik.values.projectName}
              onChange={formik.handleChange}
              error={
                formik.touched.projectName && Boolean(formik.errors.projectName)
              }
              helperText={
                (formik.touched.projectName && formik.errors.projectName) ||
                'Enter a name for your new project.'
              }
            />
            <FormControl fullWidth>
              <InputLabel required id="new-proj-select-category-label">
                Category
              </InputLabel>
              <Select
                id="projectCategory"
                name="projectCategory"
                labelId="new-proj-select-category-label"
                label="Category"
                required
                disabled={formik.isSubmitting}
                value={formik.values.projectCategory}
                // defaultValue="Binary Tree"
                onChange={formik.handleChange}
                error={
                  formik.touched.projectCategory &&
                  Boolean(formik.errors.projectCategory)
                }
              >
                {categoriesList.map((category) => (
                  <MenuItem key={category} value={category}>
                    {categoryLabels[category]}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a data structure category.</FormHelperText>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  id="isPublic"
                  name="isPublic"
                  defaultChecked
                  disabled={formik.isSubmitting}
                  value={formik.values.isPublic}
                  onChange={formik.handleChange}
                />
              }
              label="Public"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" loading={formik.isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
