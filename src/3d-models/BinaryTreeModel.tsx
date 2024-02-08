/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 blender/logotype/binary_tree.glb -o src/3d-models/BinaryTree.tsx -TtD 
Files: blender/logotype/binary_tree.glb [819.42KB] > C:\Users\Max\projects\leetpal\src\3d-models\binary_tree-transformed.glb [84.2KB] (90%)
*/
import { useGLTF } from "@react-three/drei";
import React from "react";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Circle001: THREE.Mesh;
    Circle001_1: THREE.Mesh;
  };
  materials: {
    ["Main-LR"]: THREE.MeshStandardMaterial;
    Emit: THREE.MeshStandardMaterial;
  };
  // animations: GLTFAction[];
};

// type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function BinaryTreeModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/assets/binary_tree-transformed.glb",
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={5.875}>
        <mesh
          geometry={nodes.Circle001.geometry}
          material={materials["Main-LR"]}
        />
        <mesh geometry={nodes.Circle001_1.geometry} material={materials.Emit} />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/binary_tree-transformed.glb");