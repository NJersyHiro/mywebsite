"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NeuralNetworkProps {
  nodeCount?: number;
  spread?: number;
  maxEdgeDistance?: number;
}

interface NodeData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

function createNodes(count: number, spread: number): NodeData[] {
  return Array.from({ length: count }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005
    ),
  }));
}

export default function NeuralNetwork({
  nodeCount = 60,
  spread = 5,
  maxEdgeDistance = 1.8,
}: NeuralNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodesData = useRef<NodeData[]>(createNodes(nodeCount, spread));

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const node = nodesData.current[i];
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodeCount]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Max possible edges: nodeCount * (nodeCount - 1) / 2
    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    const positions = new Float32Array(maxEdges * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [nodeCount]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#00d4ff"),
        size: 0.06,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#7b2ff7"),
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame(() => {
    const nodes = nodesData.current;
    const halfSpread = spread / 2;

    // Update node positions with drift and bounce
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.position.add(node.velocity);

      // Bounce within bounds
      if (Math.abs(node.position.x) > halfSpread) {
        node.velocity.x *= -1;
        node.position.x = Math.sign(node.position.x) * halfSpread;
      }
      if (Math.abs(node.position.y) > halfSpread) {
        node.velocity.y *= -1;
        node.position.y = Math.sign(node.position.y) * halfSpread;
      }
      if (Math.abs(node.position.z) > halfSpread) {
        node.velocity.z *= -1;
        node.position.z = Math.sign(node.position.z) * halfSpread;
      }
    }

    // Update points geometry
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < nodes.length; i++) {
        posAttr.setXYZ(
          i,
          nodes[i].position.x,
          nodes[i].position.y,
          nodes[i].position.z
        );
      }
      posAttr.needsUpdate = true;
    }

    // Update line geometry (edges between nearby nodes)
    if (linesRef.current) {
      const linePos = linesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      let edgeIndex = 0;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < maxEdgeDistance) {
            linePos.setXYZ(
              edgeIndex * 2,
              nodes[i].position.x,
              nodes[i].position.y,
              nodes[i].position.z
            );
            linePos.setXYZ(
              edgeIndex * 2 + 1,
              nodes[j].position.x,
              nodes[j].position.y,
              nodes[j].position.z
            );
            edgeIndex++;
          }
        }
      }

      linePos.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, edgeIndex * 2);
    }
  });

  return (
    <group>
      <points
        ref={pointsRef}
        geometry={pointsGeometry}
        material={pointsMaterial}
      />
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        material={lineMaterial}
      />
    </group>
  );
}
