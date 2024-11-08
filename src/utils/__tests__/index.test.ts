import { alpha } from "@mui/material";
import type { RelationType } from "react-archer/lib/types";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { isNumber, stringifySolutionResult } from "#/shared/lib";
import { CallstackHelper } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { getImageUrl, processNodeRelation } from "#/utils";

import { safeStringify } from "../../shared/lib/stringifySolutionResult";

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

  describe("stringifySolutionResult", () => {
    it('should return "null" for null input', () => {
      const result = stringifySolutionResult(null);
      expect(result).toBe("null");
    });

    it('should return "undefined" for undefined input', () => {
      const result = stringifySolutionResult(undefined);
      expect(result).toBe("undefined");
    });
  });

  describe("safeStringify", () => {
    const callstack = new CallstackHelper();

    it("should return the string itself for string input", () => {
      const result = safeStringify("test");
      expect(result).toBe("test");
    });

    it("should return the number itself for number input", () => {
      const result = safeStringify(123);
      expect(result).toBe("123");
    });

    it("should return the bigint itself for bigint input", () => {
      const result = safeStringify(BigInt(123));
      expect(result).toBe("123n");
    });

    it("should return a string representation of a Set", () => {
      const result = safeStringify(new Set([1, 2, 3]));
      expect(result).toBe("Set (3) {1, 2, 3}");
    });

    it("should return a string representation of a Map", () => {
      const result = safeStringify(
        new Map([
          ["key1", "value1"],
          ["key2", "value2"],
        ]),
      );
      expect(result).toBe("Map (2) {key1 => value1, key2 => value2}");
    });

    it("should return a string representation of a LinkedListNode", () => {
      const node3 = new LinkedListNode(
        3,
        null,
        { id: "node3", type: ArgumentType.LINKED_LIST },
        "list3",
        callstack,
      );
      const node2 = new LinkedListNode(
        2,
        node3,
        { id: "node2", type: ArgumentType.LINKED_LIST },
        "list2",
        callstack,
      );
      const node1 = new LinkedListNode(
        1,
        node2,
        { id: "node1", type: ArgumentType.LINKED_LIST },
        "list1",
        callstack,
      );
      const result = safeStringify(node1);
      expect(result).toBe("[1 -> 2 -> 3]");
    });

    it("should return a string representation of an array", () => {
      const result = safeStringify([1, "test", BigInt(3)]);
      expect(result).toBe("[1, test, 3n]");
    });

    it("should return a string representation of an object with meta type BINARY_TREE", () => {
      const binaryTreeNode = new BinaryTreeNode(
        1,
        null,
        null,
        {
          id: "node1",
          type: ArgumentType.BINARY_TREE,
          depth: 0,
        },
        "tree1",
        callstack,
      );
      const result = safeStringify(binaryTreeNode);
      expect(result).toBe("Binary Tree [1]");
    });

    it("should return a string representation of an object with a non-finite number", () => {
      const result = safeStringify({ value: Infinity });
      expect(result).toBe('{\n  "value": "Inf"\n}');
    });

    it("should return a string representation of an object with a bigint", () => {
      const result = safeStringify({ value: BigInt(123) });
      expect(result).toBe('{\n  "value": "123n"\n}');
    });
  });
});
