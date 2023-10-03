import { alpha } from "@mui/material";
import type { RelationType } from "react-archer/lib/types";

import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { getImageUrl, isNumber, processNodeRelation } from "#/utils";
import { ArgumentType } from "#/utils/argumentObject";

describe("utils", () => {
  describe("getImageUrl", () => {
    it("should return the correct url", () => {
      const imageName = "test.png";
      expect(getImageUrl(imageName)).toBe(
        `${process.env.NEXT_PUBLIC_BUCKET_BASE_URL}/${imageName}`,
      );
    });
  });

  describe("isNumber", () => {
    it("should return true for numbers", () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber(0.1)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });

    it("should return false for non-numbers", () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber("1")).toBe(false);
      expect(isNumber("0")).toBe(false);
    });
  });

  describe("processNodeRelation", () => {
    it("should not throw if data is undefined or null", () => {
      const nodeColor = "#000";
      const color = "#fff";
      const data = null;

      expect(() => processNodeRelation([], nodeColor)).not.toThrow();
      expect(() =>
        processNodeRelation([], nodeColor, color, data),
      ).not.toThrow();
    });

    let relations: RelationType[] = [];
    const nodeColor = "#000";
    const color = "#fff";
    const data: TreeNodeData = {
      id: "1",
      value: 1,
      argType: ArgumentType.BINARY_TREE,
      depth: 0,
      childrenIds: [],
      x: 0,
      y: 0,
    };

    it("should return the correct relations", () => {
      processNodeRelation(relations, nodeColor, color, data);

      expect(relations).toEqual([
        {
          targetAnchor: "middle",
          sourceAnchor: "middle",
          targetId: "1",
          style: { strokeColor: undefined },
        },
      ]);
    });

    it("should return the colored relation if node colors match", () => {
      relations = [];
      data.color = color;
      processNodeRelation(relations, nodeColor, color, data);

      expect(relations).toEqual([
        {
          targetAnchor: "middle",
          sourceAnchor: "middle",
          targetId: "1",
          style: { strokeColor: alpha(nodeColor, 0.4) },
        },
      ]);
    });
  });
});
