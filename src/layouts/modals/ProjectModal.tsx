import { DeleteForever } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import type { DialogProps } from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { type PlaygroundProject, ProjectCategory } from "@prisma/client";
import type { UseQueryResult } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import * as yup from "yup";

import { usePlaygroundSlugs, usePrevious } from "#/hooks";
import { useAppDispatch } from "#/store/hooks";
import { projectSlice } from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";

const categoriesList = Object.values(ProjectCategory);
const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.BINARY_TREE]: "Binary Tree",
  [ProjectCategory.ARRAY]: "Array",
  [ProjectCategory.BST]: "BST",
  [ProjectCategory.GRAPH]: "Graph",
  [ProjectCategory.GRID]: "Grid",
};

const validationSchema = yup.object({
  projectName: yup
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(190, "Project name must be at most 190 characters")
    .required("Project name is required"),
  projectSlug: yup
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be at most 100 characters")
    .matches(/^[a-zA-Z](-?[a-zA-Z0-9])*$/, "Must be a valid URL slug"),
  projectCategory: yup.string().required("Project category is required"),
});

type ProjectModalProps = DialogProps & {
  onClose: () => void;
  currentProject: UseQueryResult<PlaygroundProject>;
  isEditMode: boolean;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  onClose,
  isEditMode,
  currentProject,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const previousProject = usePrevious(currentProject.data);

  const createProject = trpc.project.create.useMutation();
  const editProject = trpc.project.update.useMutation();
  const deleteProject = trpc.project.delete.useMutation();
  const trpcUtils = trpc.useContext();

  const { setProject, clearSlugs } = usePlaygroundSlugs();

  const formik = useFormik({
    initialValues: {
      projectName: "",
      projectSlug: "",
      projectCategory: "" as ProjectCategory,
      projectDescription: "",
      isPublic: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      let successMessage = "";
      try {
        if (isEditMode && currentProject.data) {
          const newProject = await editProject.mutateAsync({
            projectId: currentProject.data.id,
            title: values.projectName,
            slug: values.projectSlug,
            category: values.projectCategory,
            description: values.projectDescription,
            isPublic: values.isPublic,
          });
          successMessage = `Project "${values.projectName}" was successfully updated 📝`;
          void trpcUtils.project.getBySlug.invalidate(newProject.slug);
          applyProjectValues(newProject);
        } else {
          const newProject = await createProject.mutateAsync({
            title: values.projectName,
            slug: values.projectSlug,
            category: values.projectCategory,
            description: values.projectDescription,
            isPublic: values.isPublic,
          });
          await trpcUtils.project.getBySlug.invalidate(newProject.slug);
          successMessage = "New project was created successfully 🎉";
          formikHelpers.resetForm();
        }

        await trpcUtils.project.allBrief.invalidate();
        void setProject(values.projectSlug);
        onClose();

        if (successMessage) {
          enqueueSnackbar(successMessage, {
            variant: "success",
          });
        }
      } catch (error: any) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            projectName: error.message,
          });
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      }
    },
  });

  const applyProjectValues = (project: PlaygroundProject) => {
    formik.setValues({
      projectName: project.title,
      projectSlug: project.slug,
      projectCategory: project.category,
      projectDescription: project.description ?? "",
      isPublic: project.isPublic,
    });
  };

  // Fill in the form when the current project changes
  useEffect(() => {
    if (
      isEditMode &&
      currentProject.data &&
      previousProject?.id !== currentProject.data.id
    ) {
      applyProjectValues(currentProject.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject.data]);

  // Clear/fill the form when switching between edit and create mode
  useEffect(() => {
    if (!isEditMode) {
      formik.resetForm();
    } else {
      currentProject.data && applyProjectValues(currentProject.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, formik.resetForm]);

  const handleDeleteProject = async () => {
    if (!currentProject.data) return;
    if (
      !confirm(
        `Are you sure you want to delete the "${currentProject.data.title}" project? This action cannot be undone.`
      ) // TODO: Replace with a custom modal
    )
      return;

    await deleteProject.mutateAsync({
      projectId: currentProject.data.id,
    });
    dispatch(projectSlice.actions.clear());
    await trpcUtils.project.allBrief.invalidate();
    await clearSlugs();
    void trpcUtils.project.getBySlug.invalidate(currentProject.data.slug);
    formik.resetForm();

    enqueueSnackbar(
      `Project "${currentProject.data.title}" was successfully deleted 🧹`,
      {
        variant: "success",
      }
    );
  };

  const isLoading =
    currentProject.isLoading ||
    createProject.isLoading ||
    editProject.isLoading ||
    formik.isSubmitting;

  return (
    <Dialog {...props} onClose={onClose}>
      <form
        onSubmit={(e) => {
          formik.handleSubmit(e);
        }}
      >
        <DialogTitle>
          {isEditMode ? "📝 Edit Project" : "👷‍♂️ Create New Project"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the project details below according to your needs.
          </DialogContentText>
          <Stack spacing={2} mt={2}>
            <TextField
              id="projectSlug"
              name="projectSlug"
              label="Slug"
              variant="outlined"
              disabled={isLoading}
              value={formik.values.projectSlug}
              onChange={formik.handleChange}
              error={
                formik.touched.projectSlug && Boolean(formik.errors.projectSlug)
              }
              helperText={
                (formik.touched.projectSlug && formik.errors.projectSlug) ||
                "You can edit a slug that's used in the URL to this project."
              }
            />
            <TextField
              id="projectName"
              name="projectName"
              label="Name"
              variant="outlined"
              required
              disabled={isLoading}
              value={formik.values.projectName}
              onChange={formik.handleChange}
              error={
                formik.touched.projectName && Boolean(formik.errors.projectName)
              }
              helperText={
                (formik.touched.projectName && formik.errors.projectName) ||
                "Enter a name for your new project."
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
                disabled={isLoading}
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
            <TextField
              id="projectDescription"
              name="projectDescription"
              label="Description"
              variant="outlined"
              multiline
              minRows={2}
              maxRows={8}
              disabled={isLoading}
              value={formik.values.projectDescription}
              onChange={formik.handleChange}
              error={
                formik.touched.projectDescription &&
                Boolean(formik.errors.projectDescription)
              }
              helperText={
                (formik.touched.projectDescription &&
                  formik.errors.projectDescription) ||
                "Optional project description."
              }
            />
            <FormControlLabel
              control={
                <Switch
                  id="isPublic"
                  name="isPublic"
                  disabled={isLoading}
                  checked={formik.values.isPublic}
                  onChange={formik.handleChange}
                />
              }
              label="Public"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {isEditMode && (
            <LoadingButton
              title="Delete this project"
              color="error"
              endIcon={<DeleteForever />}
              disabled={isLoading}
              loading={deleteProject.isLoading}
              loadingPosition="end"
              onClick={handleDeleteProject}
              sx={{ mr: "auto" }}
            >
              Delete
            </LoadingButton>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton
            type="submit"
            disabled={isLoading}
            loading={formik.isSubmitting}
          >
            {isEditMode ? "Update" : "Create"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
