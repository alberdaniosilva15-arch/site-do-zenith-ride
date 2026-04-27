import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   GLSL: Curl Noise (3D)
   Classic implementation based on Akella / Stefan Gustavson
   Used to create organic swirling motion during dispersion
   ═══════════════════════════════════════════════════════════════ */

const curlNoiseGLSL = `
  //
  // Simplex 3D Noise (Stefan Gustavson)
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.1;
    float n1, n2;
    vec3 curl;

    n1 = snoise(vec3(p.x, p.y + e, p.z));
    n2 = snoise(vec3(p.x, p.y - e, p.z));
    float a = (n1 - n2) / (2.0 * e);
    n1 = snoise(vec3(p.x, p.y, p.z + e));
    n2 = snoise(vec3(p.x, p.y, p.z - e));
    float b = (n1 - n2) / (2.0 * e);
    curl.x = a - b;

    n1 = snoise(vec3(p.x, p.y, p.z + e));
    n2 = snoise(vec3(p.x, p.y, p.z - e));
    a = (n1 - n2) / (2.0 * e);
    n1 = snoise(vec3(p.x + e, p.y, p.z));
    n2 = snoise(vec3(p.x - e, p.y, p.z));
    b = (n1 - n2) / (2.0 * e);
    curl.y = a - b;

    n1 = snoise(vec3(p.x + e, p.y, p.z));
    n2 = snoise(vec3(p.x - e, p.y, p.z));
    a = (n1 - n2) / (2.0 * e);
    n1 = snoise(vec3(p.x, p.y + e, p.z));
    n2 = snoise(vec3(p.x, p.y - e, p.z));
    b = (n1 - n2) / (2.0 * e);
    curl.z = a - b;

    return curl;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   VERTEX SHADER
   Akella-style: image-sampled particles with curl noise dispersion,
   luminosity-based depth, and organic breathing.
   ═══════════════════════════════════════════════════════════════ */

const vertexShader = `
  ${curlNoiseGLSL}

  uniform float uTime;
  uniform vec2 uMouse;        // normalised mouse in world-ish coords
  uniform float uHoverRadius; // radius of influence
  uniform sampler2D uTexture;

  attribute vec2 aUv;         // grid UV
  attribute float aRandom;    // per-particle random seed

  varying vec2 vUv;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    vUv = aUv;

    // Sample image to get colour/brightness
    // Flip V because WebGL textures have (0,0) at bottom-left
    vec2 flippedUv = vec2(aUv.x, 1.0 - aUv.y);
    vec4 texColor = texture2D(uTexture, flippedUv);
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // Discard nearly-black pixels (background)
    float threshold = 0.06;
    if (luminance < threshold && texColor.a < 0.1) {
      gl_Position = vec4(9999.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      return;
    }

    // Base grid position from UV → 3D plane
    vec3 pos = position;

    // === DEPTH FROM LUMINANCE (pseudo-3D) ===
    // Bright areas come forward, dark areas recede
    float depth = luminance * 0.6;
    pos.z += depth;

    // === IDLE BREATHING ===
    // Visible organic motion — particles drift gently like floating dust
    float phase = aRandom * 6.2831;
    pos.x += sin(uTime * 0.4 + phase) * 0.045;
    pos.y += cos(uTime * 0.3 + phase * 0.7) * 0.04;
    pos.z += sin(uTime * 0.35 + phase * 1.3) * 0.025;

    // === MOUSE DISPERSION (Curl Noise) ===
    // Compute distance from this particle to the mouse in XY
    float dx = pos.x - uMouse.x;
    float dy = pos.y - uMouse.y;
    float dist = length(vec2(dx, dy));

    // Proximity factor (0 = far, 1 = right on mouse)
    float proximity = smoothstep(uHoverRadius, 0.0, dist);

    // Apply curl noise displacement scaled by proximity
    // The noise seed includes time so it swirls continuously
    vec3 noisePos = pos * 1.5 + vec3(uTime * 0.15);
    vec3 curl = curlNoise(noisePos);

    // Displace using curl noise — creates organic vortex patterns
    pos += curl * proximity * 1.2;

    // Also push outward from mouse (radial force)
    vec3 pushDir = normalize(vec3(dx, dy, aRandom * 0.5));
    pos += pushDir * proximity * 0.6;

    // === TRANSFORM ===
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;
    vAlpha = smoothstep(threshold, 0.15, luminance) * texColor.a;

    // Point size: proportional to brightness + depth scaling
    float baseSize = mix(1.5, 3.5, luminance);
    gl_PointSize = baseSize * (10.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   FRAGMENT SHADER
   Soft glow particles with image colour sampling
   ═══════════════════════════════════════════════════════════════ */

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    if (vAlpha < 0.01) discard;

    // Soft circular particle with glow
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float softEdge = smoothstep(0.5, 0.05, dist);

    // Sample original image colour (flip V to match vertex shader)
    vec2 flippedUv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture2D(uTexture, flippedUv);

    // Add subtle gold tint to dark areas
    vec3 goldTint = vec3(0.85, 0.65, 0.20);
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 color = mix(texColor.rgb * 1.3, texColor.rgb + goldTint * 0.15, 1.0 - luminance);

    // Depth fog (subtle)
    float fog = clamp(1.0 - (vDepth - 3.0) * 0.04, 0.4, 1.0);
    color *= fog;

    // Subtle shimmer
    float shimmer = 1.0 + sin(uTime * 2.0 + vUv.x * 30.0 + vUv.y * 20.0) * 0.05;
    color *= shimmer;

    gl_FragColor = vec4(color, softEdge * vAlpha * 0.92);
  }
`;

/* ═══════════════════════════════════════════════════════════════
   Particle Grid Generator
   Creates a dense UV grid that maps onto the image texture.
   Each point gets the colour from the texture in the shader.
   ═══════════════════════════════════════════════════════════════ */

interface GridData {
  positions: Float32Array;
  uvs: Float32Array;
  randoms: Float32Array;
  count: number;
}

function generateGrid(width: number, height: number, gridSize: number = 250): GridData {
  const positions: number[] = [];
  const uvs: number[] = [];
  const randoms: number[] = [];

  const aspect = width / height;
  const planeW = 4.0 * aspect;
  const planeH = 4.0;

  for (let iy = 0; iy < gridSize; iy++) {
    for (let ix = 0; ix < gridSize; ix++) {
      const u = ix / (gridSize - 1);
      const v = iy / (gridSize - 1);

      // Position on a plane centered at origin
      const x = (u - 0.5) * planeW;
      const y = (v - 0.5) * -planeH; // flip Y so top of image = top of plane
      const z = 0;

      positions.push(x, y, z);
      uvs.push(u, v);
      randoms.push(Math.random());
    }
  }

  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    randoms: new Float32Array(randoms),
    count: gridSize * gridSize,
  };
}

/* ═══════════════════════════════════════════════════════════════
   R3F Component: Particle Image
   ═══════════════════════════════════════════════════════════════ */

function ParticleImage({ imageUrl }: { imageUrl: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ w: 1, h: 1 });

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexture(tex);
      setImgDimensions({ w: tex.image.width, h: tex.image.height });
    });
  }, [imageUrl]);

  // Grid geometry — 200x200 = 40k particles (optimal balance quality/performance)
  const gridData = useMemo(() => {
    return generateGrid(imgDimensions.w, imgDimensions.h, 200);
  }, [imgDimensions]);

  // Mouse position (world space approximation)
  const mouseRef = useRef(new THREE.Vector2(9999, 9999));

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const el = document.querySelector(".shatter-lab-canvas");
      if (!el) return;
      const rect = el.getBoundingClientRect();

      let clientX, clientY;
      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Only track when mouse/touch is over the section
      if (clientY < rect.top || clientY > rect.bottom || clientX < rect.left || clientX > rect.right) {
        mouseRef.current.set(9999, 9999);
        return;
      }

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Unproject to world coords at z=0
      const vec = new THREE.Vector3(x, y, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      const world = camera.position.clone().add(dir.multiplyScalar(t));
      mouseRef.current.set(world.x, world.y);
    };

    const handleLeave = () => mouseRef.current.set(9999, 9999);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("touchend", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchend", handleLeave);
    };
  }, [camera]);

  // Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uHoverRadius: { value: 1.2 },
      uTexture: { value: texture },
    }),
    [texture]
  );

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Instant reaction when mouse is active, very slow graceful return when it leaves
    const isActive = mouseRef.current.x < 1000;
    const lerpSpeed = isActive ? 1.0 : 0.015;
    mat.uniforms.uMouse.value.lerp(mouseRef.current, lerpSpeed);

    // Gentle continuous rotation (slow showcase spin)
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.12;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.03;
  });

  if (!texture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[gridData.positions, 3]} />
        <bufferAttribute attach="attributes-aUv" args={[gridData.uvs, 2]} />
        <bufferAttribute attach="attributes-aRandom" args={[gridData.randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Floating "ZENITH" Text Particles
   ═══════════════════════════════════════════════════════════════ */

function ZenithTextParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#c9a84c";
    ctx.font = "bold 48px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ZENITH", 256, 34);

    const imgData = ctx.getImageData(0, 0, 512, 64).data;
    const pts: number[] = [];
    const phs: number[] = [];
    const step = 2;

    for (let y = 0; y < 64; y += step) {
      for (let x = 0; x < 512; x += step) {
        const i = (y * 512 + x) * 4;
        if (imgData[i] > 60) {
          // Largura 4.0 e Y 1.7 — bem dentro dos limites da câmara
          pts.push((x / 512 - 0.5) * 4.0, -(y / 64 - 0.5) * 0.5 + 1.7, 0);
          phs.push(Math.random());
        }
      }
    }

    return { positions: new Float32Array(pts), phases: new Float32Array(phs) };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.12;
  });

  const vertexText = `
    uniform float uTime;
    attribute float aPhase;
    varying float vOpacity;

    void main() {
      vec3 pos = position;
      float phase = aPhase * 6.2831;
      pos.x += sin(uTime * 0.25 + phase) * 0.01;
      pos.y += cos(uTime * 0.2 + phase * 0.7) * 0.01;

      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 2.0 * (10.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
      vOpacity = 0.85;
    }
  `;

  const fragmentText = `
    varying float vOpacity;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
      vec3 gold = vec3(0.78, 0.60, 0.22);
      gl_FragColor = vec4(gold, alpha);
    }
  `;

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial;
    if (mat) mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexText}
        fragmentShader={fragmentText}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Section Component
   ═══════════════════════════════════════════════════════════════ */

export default function ShatterLab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center bg-[hsl(0,0%,2%)] overflow-hidden">
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, hsl(40 55% 12% / 0.2) 0%, transparent 70%)",
        }}
      />

      {/* Three.js Canvas — only renders when section is visible */}
      <div className="shatter-lab-canvas absolute inset-0 z-[1]">
        {isVisible && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={1}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          >
            <ParticleImage imageUrl="/assets/lab_car.png" />
            <ZenithTextParticles />
          </Canvas>
        )}
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-10 left-0 right-0 z-[2] flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-gold-royal/40 to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-gold-royal/70">
          Laboratório Zenith
        </p>
        <p className="font-body text-[10px] text-muted-foreground/50">
          Mova o cursor para interagir
        </p>
      </div>

      {/* HUD corners */}
      <div className="absolute top-8 left-8 z-[2] pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal/40">
          ◆ WebGL Lab
        </p>
      </div>
      <div className="absolute top-8 right-8 z-[2] pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal/40">
          Shader 3D
        </p>
      </div>
    </section>
  );
}
