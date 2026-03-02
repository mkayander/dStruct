import type { GLTF } from "three-stdlib";

type GltfWithNodes = GLTF & {
  nodes: Record<string, unknown>;
  materials: Record<string, unknown>;
};

/**
 * Type guard to narrow GLTF & ObjectMap to a specific GLTFResult structure.
 * Validates at runtime that the required node keys exist.
 */
export function assertGltfNodes<T extends GltfWithNodes>(
  gltf: GltfWithNodes,
  requiredNodeKeys: readonly (keyof T["nodes"])[],
): asserts gltf is T {
  const { nodes } = gltf;
  if (!nodes || typeof nodes !== "object") {
    throw new Error("Invalid GLTF: missing nodes");
  }
  for (const key of requiredNodeKeys) {
    const node = nodes[key as string];
    if (!node || typeof node !== "object" || !("geometry" in node)) {
      throw new Error(`Invalid GLTF: missing or invalid node "${String(key)}"`);
    }
  }
}
