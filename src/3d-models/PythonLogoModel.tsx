/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 blender/python/python.glb -o src/3d-models/PythonLogoModel.tsx -TtD 
Files: blender/python/python.glb [308.46KB] > C:\Users\Max\projects\leetpal\src\3d-models\python-transformed.glb [65.8KB] (79%)
*/
import { useGLTF } from "@react-three/drei";
import React from "react";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Main_LP: THREE.Mesh;
    path1950007: THREE.Mesh;
    path1950007_1: THREE.Mesh;
  };
  materials: {
    Main: THREE.MeshStandardMaterial;
    ["Emit Blue LP"]: THREE.MeshStandardMaterial;
    ["Emit Gold LP"]: THREE.MeshStandardMaterial;
  };
};

const assetPath = "/assets/python-transformed.glb";

export function PythonLogoModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(assetPath) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Main_LP.geometry}
        material={materials.Main}
        rotation={[Math.PI / 2, 0, 0]}
        scale={200}
      />
      <group rotation={[Math.PI / 2, 0, 0]} scale={200}>
        <mesh
          geometry={nodes.path1950007.geometry}
          material={materials["Emit Blue LP"]}
        />
        <mesh
          geometry={nodes.path1950007_1.geometry}
          material={materials["Emit Gold LP"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload(assetPath);