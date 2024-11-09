import { Stack } from "@mui/material";
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
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { EditFormModal } from "#/shared/ui/organisms/EditFormModal";
import { useAppSelector } from "#/store/hooks";
import { trpc } from "#/utils";

const complexityRegExp = /^O\([\w\s*+\-/^(),!]+\)$/;

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
    .matches(/^[a-zA-Z0-9](-?[a-zA-Z0-9])*$/, "Must be a valid URL slug"),
  solutionTimeComplexity: yup
    .string()
    .max(20, "Time complexity must be at most 20 characters")
    .matches(
      complexityRegExp,
      "Must be a in the form of O(n), O(n^2), O(n+m), etc.",
    ),
  solutionSpaceComplexity: yup
    .string()
    .max(20, "Space complexity must be at most 20 characters")
    .matches(
      complexityRegExp,
      "Must be a in the form of O(n), O(n^2), O(n+m), etc.",
    ),
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
  const isMobile = useMobileLayout();

  const currentProjectId = useAppSelector(selectProjectId) || "";

  const invalidateQueries = () => {
    void trpcUtils.project.getBySlug.invalidate(projectSlug);
  };

  const currentSolution = trpc.project.getSolutionBySlug.useQuery(
    { projectId: currentProjectId, slug: solutionSlug },
    { enabled: Boolean(currentProjectId && solutionSlug) },
  );

  const trpcUtils = trpc.useContext();

  const formik = useFormik({
    initialValues: {
      solutionName: "",
      solutionSlug: "",
      solutionTimeComplexity: "",
      solutionSpaceComplexity: "",
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
          timeComplexity: values.solutionTimeComplexity,
          spaceComplexity: values.solutionSpaceComplexity,
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
      trpcUtils.project.getSolutionBySlug.setData(
        { slug: data.slug, projectId: data.projectId },
        data,
      );

      onClose();

      enqueueSnackbar(
        `🚀 Solution "${data.title}" was successfully updated 📝`,
        { variant: "success" },
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
        },
      );
    },
  });

  useEffect(() => {
    formik.resetForm();
    if (currentSolution.data) {
      formik.setValues({
        solutionName: currentSolution.data.title,
        solutionSlug: currentSolution.data.slug,
        solutionTimeComplexity: currentSolution.data.timeComplexity ?? "",
        solutionSpaceComplexity: currentSolution.data.spaceComplexity ?? "",
        solutionDescription: currentSolution.data.description ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSolution.data]);

  const handleSolutionDelete = async () => {
    if (!currentSolution.data) return;
    if (
      !confirm(
        `Are you sure you want to delete the "${currentSolution.data.title}" test case? This action cannot be undone.`,
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
      }),
    );
  };

  return (
    <EditFormModal
      formik={formik}
      title={`🚀 ${LL.EDIT_SOLUTION()}`}
      summary="Edit the details of your solution"
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
          "The name of your solution"
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
          "You can edit a slug that's used in the URL to this solution"
        }
      />
      <Stack direction={isMobile ? "column" : "row"} spacing={1}>
        <TextField
          id="solutionTimeComplexity"
          name="solutionTimeComplexity"
          label={LL.TIME_COMPLEXITY()}
          variant="outlined"
          disabled={formik.isSubmitting}
          value={formik.values.solutionTimeComplexity}
          onChange={formik.handleChange}
          error={
            formik.touched.solutionTimeComplexity &&
            Boolean(formik.errors.solutionTimeComplexity)
          }
          helperText={
            (formik.touched.solutionTimeComplexity &&
              formik.errors.solutionTimeComplexity) ||
            "How input size affects the running time"
          }
          placeholder="E.g. O(n), O(n^2), O(n+m), etc."
          sx={{ minWidth: 200, flexGrow: 1 }}
        />
        <TextField
          id="solutionSpaceComplexity"
          name="solutionSpaceComplexity"
          label={LL.SPACE_COMPLEXITY()}
          variant="outlined"
          disabled={formik.isSubmitting}
          value={formik.values.solutionSpaceComplexity}
          onChange={formik.handleChange}
          error={
            formik.touched.solutionSpaceComplexity &&
            Boolean(formik.errors.solutionSpaceComplexity)
          }
          helperText={
            (formik.touched.solutionSpaceComplexity &&
              formik.errors.solutionSpaceComplexity) ||
            "How input size affects the memory usage"
          }
          placeholder="E.g. O(n), O(n^2), O(n+m), etc."
          sx={{ minWidth: 200, flexGrow: 1 }}
        />
      </Stack>
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
          "Optional solution description"
        }
      />
    </EditFormModal>
  );
};
