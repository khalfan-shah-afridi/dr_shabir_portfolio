import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ==========================================
// GALAXY PARTICLES
// ==========================================
function GalaxyParticles() {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const count = 6500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.65) * 8.5;

      const arms = 5;
      const arm =
        (i % arms) * ((Math.PI * 2) / arms);

      const spiral =
        radius * 0.72;

      const angle =
        arm +
        spiral +
        (Math.random() - 0.5) *
          (0.55 + radius * 0.025);

      const spread =
        (Math.random() - 0.5) *
        (1.0 - radius * 0.055);

      positions[i * 3] =
        Math.cos(angle) *
          radius +
        spread;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) *
        (0.65 + radius * 0.06);

      positions[i * 3 + 2] =
        Math.sin(angle) *
          radius +
        spread;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.z =
      state.clock.elapsedTime * 0.025;

    pointsRef.current.rotation.y =
      Math.sin(
        state.clock.elapsedTime * 0.08
      ) * 0.08;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles}
      stride={3}
      frustumCulled
    >
      <PointMaterial
        transparent
        color="#d8dce8"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.72}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ==========================================
// CENTRAL GALAXY GLOW
// ==========================================
function GalaxyCore() {
  const coreRef = useRef();

  useFrame((state) => {
    if (!coreRef.current) return;

    coreRef.current.rotation.z =
      state.clock.elapsedTime * 0.04;
  });

  return (
    <>
      <mesh
        ref={coreRef}
        position={[0, 0, -0.5]}
      >
        <sphereGeometry
          args={[1.35, 64, 64]}
        />

        <meshBasicMaterial
          color="#e6e9f2"
          transparent
          opacity={0.08}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={14}
        distance={8}
        color="#dfe4f0"
      />
    </>
  );
}

// ==========================================
// FLOATING DUST
// ==========================================
function FloatingDust() {
  const dustRef = useRef();

  const particles = useMemo(() => {
    const count = 900;
    const positions =
      new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * 14;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 8;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 10;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!dustRef.current) return;

    dustRef.current.rotation.y =
      state.clock.elapsedTime * 0.008;

    dustRef.current.rotation.x =
      Math.sin(
        state.clock.elapsedTime * 0.04
      ) * 0.03;
  });

  return (
    <Points
      ref={dustRef}
      positions={particles}
      stride={3}
      frustumCulled
    >
      <PointMaterial
        transparent
        color="#b8bfce"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.38}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ==========================================
// GALAXY SCENE
// ==========================================
function Scene() {
  return (
    <>
      <ambientLight intensity={0.18} />

      <GalaxyParticles />

      <FloatingDust />

      <GalaxyCore />

      <pointLight
        position={[4, 2, 3]}
        intensity={2.5}
        distance={12}
        color="#9ca7bb"
      />

      <pointLight
        position={[-4, -2, 2]}
        intensity={2}
        distance={10}
        color="#c0c7d4"
      />
    </>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ThreeBackground() {
  return (
    <div className="three-background">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 52,
        }}
        dpr={[1, 1.5]}
      >
        <fog
          attach="fog"
          args={["#7a7f88", 9, 22]}
        />

        <Scene />
      </Canvas>
    </div>
  );
}