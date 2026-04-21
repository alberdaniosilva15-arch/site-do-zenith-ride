import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 420;
const MOBILE_COUNT = 150;

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

const goldVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aBrightness;
  uniform float uTime;
  uniform float uScroll;
  varying float vBrightness;
  varying float vAlpha;

  void main() {
    vBrightness = aBrightness;

    vec3 pos = position;
    float t = uTime * 0.18 + aPhase;
    pos.x += sin(t) * 0.14;
    pos.y += cos(t * 0.8) * 0.18 + sin(uScroll * 3.14159) * 0.1;
    pos.z += sin(t * 0.5) * 0.12;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPos.z;
    vAlpha = smoothstep(14.0, 3.0, dist) * (0.18 + 0.45 * aBrightness);

    gl_PointSize = aSize * (95.0 / dist) * (1.0 + uScroll * 0.08);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const goldFragmentShader = `
  varying float vBrightness;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d) * vAlpha;

    vec3 deepGold = vec3(0.36, 0.24, 0.04);
    vec3 royalGold = vec3(0.79, 0.66, 0.30);
    vec3 brightGold = vec3(0.96, 0.91, 0.69);

    vec3 color = mix(deepGold, royalGold, vBrightness);
    color = mix(color, brightGold, pow(vBrightness, 1.8));
    color *= 0.65 + pow(1.0 - d, 2.0) * 0.7;

    gl_FragColor = vec4(color, alpha);
  }
`;

function GoldParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const count = isMobile() ? MOBILE_COUNT : PARTICLE_COUNT;

  const { positions, sizes, phases, brightness } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const ph = new Float32Array(count);
    const b = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8;
      p[i * 3 + 2] = (Math.random() - 0.5) * 7;
      s[i] = Math.random() * 2.2 + 0.4;
      ph[i] = Math.random() * Math.PI * 2;
      b[i] = Math.random();
    }
    return { positions: p, sizes: s, phases: ph, brightness: b };
  }, [count]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uScroll.value = scrollRef.current;
    meshRef.current.rotation.y = clock.elapsedTime * 0.01 + mouseRef.current.x * 0.08;
    meshRef.current.rotation.x = mouseRef.current.y * 0.04;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[brightness, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={goldVertexShader}
        fragmentShader={goldFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SoftHalo() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.elapsedTime * 0.03;
    const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.2, -2.8]}>
      <ringGeometry args={[2.2, 2.7, 96]} />
      <meshBasicMaterial color="#c9a84c" transparent opacity={0.06} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function GoldParticleScene() {
  const dpr = typeof window === "undefined" ? 1 : isMobile() ? 1 : Math.min(window.devicePixelRatio, 1.5);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 52 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
      >
        <fog attach="fog" args={["#050400", 5, 14]} />
        <GoldParticles />
        <SoftHalo />
      </Canvas>
    </div>
  );
}
