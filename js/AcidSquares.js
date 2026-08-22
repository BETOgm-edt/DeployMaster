import { Renderer, Program, Mesh, Triangle, RenderTarget } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const DETAIL_STEPS = { low: 20, medium: 32, high: 48 };
const stepsFor = detail => DETAIL_STEPS[detail] || DETAIL_STEPS.medium;

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uWaveDepth;
uniform float uZoom;
uniform float uDensity;
uniform float uSpread;
uniform float uStepSize;
uniform float uGlow;
uniform float uExposure;
uniform float uColorShift;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform float uSteps;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uEnableMouse;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;
  float zoom = max(uZoom, 0.05);
  float aspect = iResolution.x / iResolution.y;
  vec2 ndc = (2.0 * frag - iResolution.xy) / iResolution.y;
  vec2 dir = ndc * (0.5 / zoom);

  vec2 mouseNdc = vec2(uMouse.x * aspect, uMouse.y);
  float mr = max(uMouseRadius, 0.01);
  vec2 md = ndc - mouseNdc;
  float dent = exp(-dot(md, md) / (mr * mr)) * (3.0 * uMouseStrength * uEnableMouse * uMouseActive);

  float travel = sin(iTime * uSpeed) * uWaveDepth;
  float density = max(uDensity, 1.0);
  float spread = clamp(uSpread, 0.05, 0.6);
  float stepSize = max(uStepSize, 0.0005);
  float glowGain = max(uGlow, 0.0);

  vec3 tOffset = vec3(0.0, dent, travel);
  vec3 p = vec3(0.0);
  float s = 0.0;
  float glow = 0.0;

  for (int i = 0; i < 64; i++) {
    if (float(i) >= uSteps) break;
    p += vec3(dir * s, s);
    vec3 q = p + tOffset;
    s += density - length(q.xz) + length(ceil(q).xy);
    s = stepSize + abs(s) * spread;
    glow += glowGain / s;
  }

  float e = glow / max(uExposure, 1.0);
  float shimmer = 0.5 + 0.5 * dot(cos(iTime * uColorShift + p), vec3(0.3333));
  float v = tanh(e * uBrightness * mix(0.7, 1.05, shimmer));
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.55, v));
  col = mix(col, uColor3, smoothstep(0.55, 1.0, v));
  col *= v;

  float a = clamp(v, 0.0, 1.0) * uOpacity;
  vec3 outRgb = col * a;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    a = clamp(a + gv, 0.0, 1.0);
  }
  fragColor = vec4(outRgb, a);
}
`;

const postFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uDirection;
uniform float uRadius;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float iTime;
out vec4 fragColor;

vec4 samp(vec2 uv) {
  return texture(tMap, uv);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;
  vec2 texel = uDirection / iResolution;
  float st = uRadius * 0.25;
  vec4 sum = samp(uv) * 0.2026;
  sum += (samp(uv + texel * st) + samp(uv - texel * st)) * 0.179;
  sum += (samp(uv + texel * (st * 2.0)) + samp(uv - texel * (st * 2.0))) * 0.124;
  sum += (samp(uv + texel * (st * 3.0)) + samp(uv - texel * (st * 3.0))) * 0.0672;
  sum += (samp(uv + texel * (st * 4.0)) + samp(uv - texel * (st * 4.0))) * 0.0285;
  vec4 col = sum;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    col.rgb = clamp(col.rgb + gv, 0.0, 1.0);
    col.a = clamp(col.a + gv, 0.0, 1.0);
  }
  fragColor = col;
}
`;

export function initAcidSquares(container, options = {}) {
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }
  if (!container) return null;

  const {
    color1 = '#34D399',
    color2 = '#75ffcd',
    color3 = '#000000',
    detail = 'high',
    speed = 0.15,
    waveDepth = 4,
    zoom = 1.4,
    density = 12.5,
    glow = 3,
    exposure = 2700,
    spread = 0.29,
    stepSize = 0.013,
    colorShift = 2,
    contrast = 2.5,
    brightness = 0.6,
    opacity = 1,
    mouseInteraction = true,
    mouseStrength = 0,
    mouseRadius = 1,
    blur = 0,
    grain = true,
    grainIntensity = 0
  } = options;

  let renderer;
  try {
    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
  } catch (err) {
    console.warn("WebGL2 not supported for AcidSquares:", err);
    return null;
  }

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  const geometry = new Triangle(gl);
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uSpeed: { value: speed },
      uWaveDepth: { value: waveDepth },
      uZoom: { value: zoom },
      uDensity: { value: density },
      uSpread: { value: spread },
      uStepSize: { value: stepSize },
      uGlow: { value: glow },
      uExposure: { value: exposure },
      uColorShift: { value: colorShift },
      uContrast: { value: contrast },
      uBrightness: { value: brightness },
      uOpacity: { value: opacity },
      uSteps: { value: stepsFor(detail) },
      uColor1: { value: new Float32Array(c1) },
      uColor2: { value: new Float32Array(c2) },
      uColor3: { value: new Float32Array(c3) },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
      uEnableMouse: { value: mouseInteraction ? 1.0 : 0.0 },
      uMouseActive: { value: 0.0 },
      uGrain: { value: grain ? 1.0 : 0.0 },
      uGrainIntensity: { value: grainIntensity }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });

  const postProgram = new Program(gl, {
    vertex,
    fragment: postFragment,
    uniforms: {
      tMap: { value: null },
      iResolution: { value: new Float32Array([1, 1]) },
      uDirection: { value: new Float32Array([1, 0]) },
      uRadius: { value: 0 },
      uGrain: { value: 0 },
      uGrainIntensity: { value: grainIntensity },
      iTime: { value: 0 }
    }
  });
  const postMesh = new Mesh(gl, { geometry, program: postProgram });

  let rtA = null;
  let rtB = null;
  const ensureTargets = () => {
    if (!rtA) {
      const bw = gl.drawingBufferWidth;
      const bh = gl.drawingBufferHeight;
      rtA = new RenderTarget(gl, { width: bw, height: bh, depth: false });
      rtB = new RenderTarget(gl, { width: bw, height: bh, depth: false });
    }
  };

  const renderFrame = () => {
    const grainOn = grain ? 1.0 : 0.0;
    program.uniforms.uGrainIntensity.value = grainIntensity;
    postProgram.uniforms.uGrainIntensity.value = grainIntensity;
    if (blur > 0) {
      ensureTargets();
      program.uniforms.uGrain.value = 0.0;
      renderer.render({ scene: mesh, target: rtA });
      const pu = postProgram.uniforms;
      pu.uRadius.value = blur * 14.0;
      pu.tMap.value = rtA.texture;
      pu.uDirection.value[0] = 1;
      pu.uDirection.value[1] = 0;
      pu.uGrain.value = 0.0;
      renderer.render({ scene: postMesh, target: rtB });
      pu.tMap.value = rtB.texture;
      pu.uDirection.value[0] = 0;
      pu.uDirection.value[1] = 1;
      pu.uGrain.value = grainOn;
      renderer.render({ scene: postMesh });
    } else {
      program.uniforms.uGrain.value = grainOn;
      renderer.render({ scene: mesh });
    }
  };

  const setSize = () => {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    renderer.setSize(w, h);
    const bw = gl.drawingBufferWidth;
    const bh = gl.drawingBufferHeight;
    const res = program.uniforms.iResolution.value;
    res[0] = bw;
    res[1] = bh;
    const pres = postProgram.uniforms.iResolution.value;
    pres[0] = bw;
    pres[1] = bh;
    if (rtA) {
      rtA.setSize(bw, bh);
      rtB.setSize(bw, bh);
    }
    renderFrame();
  };

  const ro = new ResizeObserver(setSize);
  ro.observe(container);
  setSize();

  const mouseTarget = [0, 0];
  const mouseCurrent = [0, 0];
  let mouseActive = 0;
  let mouseActiveTarget = 0;

  const handleMouseMove = e => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2.0;
    mouseTarget[0] = x;
    mouseTarget[1] = y;
    mouseActiveTarget = 1;
  };
  const handleMouseLeave = () => {
    mouseActiveTarget = 0;
  };
  window.addEventListener('mousemove', handleMouseMove);

  let raf = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const t0 = performance.now();

  const loop = t => {
    program.uniforms.iTime.value = (t - t0) * 0.001;

    mouseCurrent[0] += 0.05 * (mouseTarget[0] - mouseCurrent[0]);
    mouseCurrent[1] += 0.05 * (mouseTarget[1] - mouseCurrent[1]);
    const m = program.uniforms.uMouse.value;
    m[0] = mouseCurrent[0];
    m[1] = mouseCurrent[1];
    const activeTarget = mouseInteraction ? mouseActiveTarget : 0;
    mouseActive += 0.05 * (activeTarget - mouseActive);
    program.uniforms.uMouseActive.value = mouseActive;

    postProgram.uniforms.iTime.value = program.uniforms.iTime.value;
    renderFrame();
    raf = requestAnimationFrame(loop);
  };

  const tryStart = () => {
    if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
  };
  const tryStop = () => {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    },
    { threshold: 0 }
  );
  io.observe(container);

  const onVisibility = () => {
    isPageVisible = !document.hidden;
    isPageVisible ? tryStart() : tryStop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  tryStart();

  return {
    destroy: () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rtA) {
        gl.deleteFramebuffer(rtA.buffer);
        gl.deleteFramebuffer(rtB.buffer);
        rtA.textures.forEach(tex => gl.deleteTexture(tex.texture));
        rtB.textures.forEach(tex => gl.deleteTexture(tex.texture));
      }
      try {
        container.removeChild(canvas);
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  };
}
