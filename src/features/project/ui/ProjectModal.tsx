import { DeleteForever } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import type { DialogProps } from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  type PlaygroundProject,
  ProjectCategory,
  ProjectDifficulty,
} from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import * as yup from "yup";

import { categoryLabels } from "#/entities/category/model/categoryLabels";
import { getDifficultyValue } from "#/entities/difficulty/lib/getDifficultyValue";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import { projectSlice } from "#/features/project/model/projectSlice";
import { useQuestionTitleLazyQuery } from "#/graphql/generated";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { usePrevious } from "#/shared/hooks";
import { useAppDispatch } from "#/store/hooks";
import { trpc } from "#/utils";

const categoriesList = Object.values(ProjectCategory);
const difficultiesList = Object.values(ProjectDifficulty);

const validationSchema = yup.object({
  projectName: yup
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(190, "Project name must be at most 190 characters")
    .required("Project name is required"),
  projectSlug: yup
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(190, "Slug must be at most 190 characters")
    .matches(/^[a-zA-Z0-9](-?[a-zA-Z0-9])*$/, "Must be a valid URI slug"),
  projectCategory: yup.string().required("Project category is required"),
  projectDescription: yup
    .string()
    .max(500, "Description must be at most 500 characters"),
  projectLcLink: yup.string().url("Must be a valid URL"),
});

enum ProblemFetchStatus {
  IDLE,
  SUCCESS,
  ERROR,
  INVALID_URL,
}

type ProjectModalProps = DialogProps & {
  onClose: () => void;
  currentProject?: PlaygroundProject;
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

  const [problemFetchStatus, setProblemFetchStatus] = useState(
    ProblemFetchStatus.IDLE,
  );
  const [getQuestionTitle, { loading: isQuestionLoading }] =
    useQuestionTitleLazyQuery({
      returnPartialData: true,
    });

  const prevEditMode = usePrevious(isEditMode);

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
      projectDifficulty: "" as ProjectDifficulty | undefined,
      projectDescription: "",
      projectLcLink: "",
      isPublic: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      let successMessage = "";
      try {
        if (isEditMode && currentProject) {
          await editProject.mutateAsync({
            projectId: currentProject.id,
            title: values.projectName,
            slug: values.projectSlug,
            category: values.projectCategory,
            difficulty: values.projectDifficulty,
            description: values.projectDescription,
            lcLink: values.projectLcLink,
            isPublic: values.isPublic,
          });
          successMessage = `Project "${values.projectName}" was successfully updated 📝`;
          void trpcUtils.project.getBySlug.invalidate(values.projectSlug);
        } else {
          await createProject.mutateAsync({
            title: values.projectName,
            slug: values.projectSlug,
            category: values.projectCategory,
            difficulty: values.projectDifficulty,
            description: values.projectDescription,
            lcLink: values.projectLcLink,
            isPublic: values.isPublic,
          });
          successMessage = "New project was created successfully 🎉";
        }

        await trpcUtils.project.allBrief.invalidate();
        void setProject(values.projectSlug);
        onClose();
        formikHelpers.resetForm();

        if (successMessage) {
          enqueueSnackbar(successMessage, {
            variant: "success",
          });
        }
      } catch (error: unknown) {
        if (error instanceof TRPCClientError && error.data.httpStatus === 400) {
          formikHelpers.setErrors({
            projectName: error.message,
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

  useEffect(() => {
    if (isEditMode && currentProject) {
      formik.setValues({
        projectName: currentProject.title,
        projectSlug: currentProject.slug,
        projectCategory: currentProject.category,
        projectDescription: currentProject.description ?? "",
        projectDifficulty: currentProject.difficulty || undefined,
        projectLcLink: currentProject.lcLink ?? "",
        isPublic: currentProject.isPublic,
      });
    } else if (prevEditMode && !isEditMode) {
      formik.resetForm();
    }
    setProblemFetchStatus(ProblemFetchStatus.IDLE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, currentProject]);

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    if (
      !confirm(
        `Are you sure you want to delete the "${currentProject.title}" project? This action cannot be undone.`,
      ) // TODO: Replace with a custom modal
    )
      return;

    await deleteProject.mutateAsync({
      projectId: currentProject.id,
    });
    dispatch(projectSlice.actions.clear());
    await trpcUtils.project.allBrief.invalidate();
    void clearSlugs();
    onClose();
    formik.resetForm();

    enqueueSnackbar(
      `Project "${currentProject.title}" was successfully deleted 🧹`,
      {
        variant: "success",
      },
    );
  };

  const handleGenerateSlug = (value?: string) => {
    formik.setFieldValue(
      "projectSlug",
      slugify(value ?? formik.values.projectName, {
        lower: true,
        strict: true,
      }),
    );
  };

  const handleFetchProblemData = async () => {
    setProblemFetchStatus(ProblemFetchStatus.IDLE);
    try {
      const url = new URL(formik.values.projectLcLink);
      const pathItems = url.pathname.split("/");
      const titleSlug = pathItems[2];
      if (
        url.hostname !== "leetcode.com" ||
        pathItems[1] !== "problems" ||
        !titleSlug
      ) {
        setProblemFetchStatus(ProblemFetchStatus.INVALID_URL);
        enqueueSnackbar("Invalid LeetCode URL", {
          variant: "error",
        });
        return;
      }

      const { data } = await getQuestionTitle({
        variables: {
          titleSlug,
        },
      });
      if (!data) return;

      void formik.setValues({
        ...formik.values,
        projectName: data.question.title,
        projectSlug: data.question.titleSlug,
        projectDifficulty: getDifficultyValue(data.question.difficulty),
      });
      setProblemFetchStatus(ProblemFetchStatus.SUCCESS);
      enqueueSnackbar("Problem data was successfully fetched 🎉", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      setProblemFetchStatus(ProblemFetchStatus.ERROR);
      enqueueSnackbar("Failed to fetch problem data!", {
        variant: "error",
      });
    }
  };

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
              id="projectName"
              name="projectName"
              label="Name"
              variant="outlined"
              required
              disabled={formik.isSubmitting}
              value={formik.values.projectName}
              onChange={(ev) => {
                formik.handleChange(ev);
                if (!formik.touched.projectSlug) {
                  handleGenerateSlug(ev.target.value);
                }
              }}
              error={
                formik.touched.projectName && Boolean(formik.errors.projectName)
              }
              helperText={
                (formik.touched.projectName && formik.errors.projectName) ||
                "Enter a name for your new project."
              }
            />
            <TextField
              id="projectSlug"
              name="projectSlug"
              label="Slug"
              variant="outlined"
              disabled={formik.isSubmitting}
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
            <FormControl fullWidth>
              <InputLabel required id="new-proj-select-difficulty-label">
                Difficulty
              </InputLabel>
              <Select
                id="projectDifficulty"
                name="projectDifficulty"
                labelId="new-proj-select-difficulty-label"
                label="Difficulty"
                required
                disabled={formik.isSubmitting}
                value={formik.values.projectDifficulty ?? ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.projectDifficulty &&
                  Boolean(formik.errors.projectDifficulty)
                }
              >
                {difficultiesList.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficultyLabels[difficulty]}
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
              disabled={formik.isSubmitting}
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
            <Stack>
              <TextField
                id="projectLcLink"
                name="projectLcLink"
                label="Problem Link"
                variant="outlined"
                disabled={formik.isSubmitting}
                value={formik.values.projectLcLink}
                onChange={formik.handleChange}
                error={
                  formik.touched.projectLcLink &&
                  Boolean(formik.errors.projectLcLink)
                }
                helperText={
                  (formik.touched.projectLcLink &&
                    formik.errors.projectLcLink) ||
                  "Where you found this problem. For example, LeetCode."
                }
              />
              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                <Tooltip
                  title="Fetch and apply problem data from LeetCode"
                  arrow
                >
                  <span>
                    <LoadingButton
                      loading={isQuestionLoading}
                      disabled={Boolean(
                        !formik.values.projectLcLink ||
                          formik.errors.projectLcLink,
                      )}
                      onClick={handleFetchProblemData}
                    >
                      Fetch Data
                    </LoadingButton>
                  </span>
                </Tooltip>
                <Alert
                  variant="outlined"
                  severity="success"
                  sx={{
                    transition: "opacity 0.5s",
                    opacity:
                      problemFetchStatus === ProblemFetchStatus.SUCCESS ? 1 : 0,
                  }}
                >
                  Problem data applied successfully!
                </Alert>
              </Stack>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  id="isPublic"
                  name="isPublic"
                  disabled={formik.isSubmitting}
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
              loading={deleteProject.isLoading}
              loadingPosition="end"
              onClick={handleDeleteProject}
              sx={{ mr: "auto" }}
            >
              Delete
            </LoadingButton>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" loading={formik.isSubmitting}>
            {isEditMode ? "Update" : "Create"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
