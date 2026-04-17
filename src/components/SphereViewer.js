import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './SphereViewer.css';

function SphereNode({ position, label, color, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function ConnectionLine({ start, end }) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={0x6a6a8a} opacity={0.3} transparent />
    </line>
  );
}

function Scene({ nodes, connections }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 50]} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 10]} intensity={0.4} />

      {/* Draw connections */}
      {connections.map((conn, idx) => (
        <ConnectionLine
          key={`conn-${idx}`}
          start={nodes[conn.from].position}
          end={nodes[conn.to].position}
        />
      ))}

      {/* Draw nodes */}
      {nodes.map((node, idx) => (
        <SphereNode
          key={`node-${idx}`}
          position={node.position}
          label={node.label}
          color={node.color}
        />
      ))}
    </>
  );
}

function SphereViewer({ data }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const generatedNodes = [];
    const generatedConnections = [];

    const processData = (obj, parentIdx = null, depth = 0, maxDepth = 3) => {
      if (depth > maxDepth) return;

      const entries = Array.isArray(obj) ? obj.map((item, i) => [i, item]) : Object.entries(obj);

      entries.forEach(([key, value], idx) => {
        const sphericalPos = generateSphericalPosition(
          generatedNodes.length,
          entries.length,
          depth
        );

        const colors = ['#64b5f6', '#81c784', '#ffb74d', '#e57373', '#ba68c8', '#4dd0e1'];
        const color = colors[depth % colors.length];

        const nodeIdx = generatedNodes.length;
        generatedNodes.push({
          label: String(key),
          position: sphericalPos,
          color,
          depth,
        });

        if (parentIdx !== null) {
          generatedConnections.push({
            from: parentIdx,
            to: nodeIdx,
          });
        }

        if (typeof value === 'object' && value !== null && depth < maxDepth) {
          processData(value, nodeIdx, depth + 1, maxDepth);
        }
      });
    };

    processData(data);
    setNodes(generatedNodes);
    setConnections(generatedConnections);
  }, [data]);

  return (
    <div className="sphere-viewer">
      <Canvas>
        <Scene nodes={nodes} connections={connections} />
      </Canvas>
    </div>
  );
}

function generateSphericalPosition(index, total, depth) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const radius = 15 + depth * 5;

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);

  return [x, y, z];
}

export default SphereViewer;