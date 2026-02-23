import { describe, expect, it } from "vitest";

import { createMockProject } from "#/features/project/__tests__/mocks/projectMocks";
import { makeStore } from "#/store/makeStore";

import {
  projectBrowserSlice,
  selectAccumulatedProjects,
  selectCurrentPage,
  selectHasMore,
  selectIsLoading,
  selectLastQueryKey,
  selectPageSize,
} from "../projectBrowserSlice";

describe("projectBrowserSlice", () => {
  const createStore = () => makeStore();

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = createStore();
      const state = store.getState().projectBrowser;

      expect(state.isLoading).toBe(false);
      expect(state.currentPage).toBe(1);
      expect(state.pageSize).toBe(20);
      expect(state.hasMore).toBe(false);
      expect(state.accumulatedProjects).toEqual([]);
      expect(state.lastQueryKey).toBe("");
    });
  });

  describe("setIsLoading", () => {
    it("should update isLoading state", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setIsLoading(true));
      expect(selectIsLoading(store.getState())).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setIsLoading(false));
      expect(selectIsLoading(store.getState())).toBe(false);
    });
  });

  describe("setCurrentPage", () => {
    it("should update currentPage", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      expect(selectCurrentPage(store.getState())).toBe(2);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));
      expect(selectCurrentPage(store.getState())).toBe(5);
    });

    it("should handle page 1", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(projectBrowserSlice.actions.setCurrentPage(1));
      expect(selectCurrentPage(store.getState())).toBe(1);
    });
  });

  describe("setHasMore", () => {
    it("should update hasMore state", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setHasMore(true));
      expect(selectHasMore(store.getState())).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setHasMore(false));
      expect(selectHasMore(store.getState())).toBe(false);
    });
  });

  describe("setAccumulatedProjects", () => {
    const createProject = (id: string, title: string, slug: string) =>
      createMockProject({ id, title, slug });

    it("should set accumulated projects", () => {
      const store = createStore();
      const projects = [
        createProject("1", "Project 1", "project-1"),
        createProject("2", "Project 2", "project-2"),
      ];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(projects),
      );

      expect(selectAccumulatedProjects(store.getState())).toEqual(projects);
    });

    it("should replace existing projects", () => {
      const store = createStore();
      const initialProjects = [createProject("1", "Project 1", "project-1")];
      const newProjects = [createProject("2", "Project 2", "project-2")];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(initialProjects),
      );
      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(newProjects),
      );

      expect(selectAccumulatedProjects(store.getState())).toEqual(newProjects);
    });

    it("should handle empty array", () => {
      const store = createStore();
      const projects = [createProject("1", "Project 1", "project-1")];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(projects),
      );
      store.dispatch(projectBrowserSlice.actions.setAccumulatedProjects([]));

      expect(selectAccumulatedProjects(store.getState())).toEqual([]);
    });
  });

  describe("appendProjects", () => {
    const createProject = (id: string, title: string, slug: string) =>
      createMockProject({ id, title, slug });

    it("should append new projects to existing ones", () => {
      const store = createStore();
      const initialProjects = [createProject("1", "Project 1", "project-1")];
      const newProjects = [createProject("2", "Project 2", "project-2")];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(initialProjects),
      );
      store.dispatch(projectBrowserSlice.actions.appendProjects(newProjects));

      const accumulated = selectAccumulatedProjects(store.getState());
      expect(accumulated).toHaveLength(2);
      expect(accumulated[0]?.id).toBe("1");
      expect(accumulated[1]?.id).toBe("2");
    });

    it("should avoid duplicates by ID", () => {
      const store = createStore();
      const initialProjects = [
        createProject("1", "Project 1", "project-1"),
        createProject("2", "Project 2", "project-2"),
      ];
      const newProjects = [
        createProject("2", "Project 2 Updated", "project-2"),
        createProject("3", "Project 3", "project-3"),
      ];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(initialProjects),
      );
      store.dispatch(projectBrowserSlice.actions.appendProjects(newProjects));

      const accumulated = selectAccumulatedProjects(store.getState());
      expect(accumulated).toHaveLength(3);
      expect(accumulated.map((p) => p.id)).toEqual(["1", "2", "3"]);
    });

    it("should handle appending to empty array", () => {
      const store = createStore();
      const newProjects = [createProject("1", "Project 1", "project-1")];

      store.dispatch(projectBrowserSlice.actions.appendProjects(newProjects));

      expect(selectAccumulatedProjects(store.getState())).toEqual(newProjects);
    });

    it("should handle empty array append", () => {
      const store = createStore();
      const initialProjects = [createProject("1", "Project 1", "project-1")];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(initialProjects),
      );
      store.dispatch(projectBrowserSlice.actions.appendProjects([]));

      expect(selectAccumulatedProjects(store.getState())).toEqual(
        initialProjects,
      );
    });
  });

  describe("clearAccumulatedProjects", () => {
    it("should clear accumulated projects and reset query key", () => {
      const store = createStore();
      const projects = [
        createMockProject({ id: "1", title: "Project 1", slug: "project-1" }),
      ];

      store.dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(projects),
      );
      store.dispatch(projectBrowserSlice.actions.setLastQueryKey("some-key"));

      store.dispatch(projectBrowserSlice.actions.clearAccumulatedProjects());

      expect(selectAccumulatedProjects(store.getState())).toEqual([]);
      expect(selectLastQueryKey(store.getState())).toBe("");
    });
  });

  describe("setLastQueryKey", () => {
    it("should update lastQueryKey", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setLastQueryKey("test-key-1"));
      expect(selectLastQueryKey(store.getState())).toBe("test-key-1");

      store.dispatch(projectBrowserSlice.actions.setLastQueryKey("test-key-2"));
      expect(selectLastQueryKey(store.getState())).toBe("test-key-2");
    });

    it("should handle empty string", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setLastQueryKey("some-key"));
      store.dispatch(projectBrowserSlice.actions.setLastQueryKey(""));

      expect(selectLastQueryKey(store.getState())).toBe("");
    });
  });

  describe("pagination state management", () => {
    it("should maintain page size constant", () => {
      const store = createStore();

      // Page size should not change
      expect(selectPageSize(store.getState())).toBe(20);

      // Dispatch various actions
      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));
      store.dispatch(projectBrowserSlice.actions.setHasMore(true));

      expect(selectPageSize(store.getState())).toBe(20);
    });

    it("should track pagination state correctly", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(projectBrowserSlice.actions.setHasMore(true));

      expect(selectCurrentPage(store.getState())).toBe(2);
      expect(selectHasMore(store.getState())).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(3));
      store.dispatch(projectBrowserSlice.actions.setHasMore(false));

      expect(selectCurrentPage(store.getState())).toBe(3);
      expect(selectHasMore(store.getState())).toBe(false);
    });
  });
});
