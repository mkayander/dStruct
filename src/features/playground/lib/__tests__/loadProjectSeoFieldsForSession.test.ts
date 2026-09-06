import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindUnique = vi.fn();
const mockGetServerSession = vi.fn();

vi.mock("#/server/db/client", () => ({
  db: {
    playgroundProject: {
      findUnique: mockFindUnique,
    },
  },
}));

vi.mock("#/server/auth/authOptions", () => ({
  authOptions: {},
}));

vi.mock("next-auth", () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

describe("loadProjectSeoFieldsForSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", isAdmin: false },
    });
  });

  it("returns null when there is no session", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const { loadProjectSeoFieldsForSession } =
      await import("#/features/playground/lib/loadProjectSeoFieldsForSession");
    const result = await loadProjectSeoFieldsForSession("private-project");

    expect(result).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("returns private project SEO for the owner", async () => {
    mockFindUnique.mockResolvedValue({
      title: "Secret Project",
      description: "Owner only",
      isPublic: false,
      userId: "user-1",
    });

    const { loadProjectSeoFieldsForSession } =
      await import("#/features/playground/lib/loadProjectSeoFieldsForSession");
    const result = await loadProjectSeoFieldsForSession("secret-project");

    expect(result).toEqual({
      title: "Secret Project",
      description: "Owner only",
    });
  });

  it("returns null for private projects when viewer is not owner", async () => {
    mockFindUnique.mockResolvedValue({
      title: "Secret Project",
      description: "Owner only",
      isPublic: false,
      userId: "other-user",
    });

    const { loadProjectSeoFieldsForSession } =
      await import("#/features/playground/lib/loadProjectSeoFieldsForSession");
    const result = await loadProjectSeoFieldsForSession("secret-project");

    expect(result).toBeNull();
  });
});
