// DeployMaster - Ultra-Smooth Emerald Fluid Aurora Background (Vanilla WebGL)

export function initBackgroundEffect(containerSelector) {
  const container = typeof containerSelector === 'string' 
    ? document.querySelector(containerSelector) 
    : containerSelector;
  if (!container) return null;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported for BackgroundEffect');
    return null;
  }

  const vsSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.y = 1.0 - st.y;
      
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
      
      float t = uTime * 0.2;
      
      // Smooth organic fluid waves
      float w1 = sin(uv.x * 1.8 + t + sin(uv.y * 1.4 + t * 0.6));
      float w2 = cos(uv.y * 2.2 - t * 0.5 + sin(uv.x * 1.9 + t * 0.4));
      float w3 = sin(length(uv * 1.2) - t * 0.4 + w1);
      
      float n = (w1 + w2 + w3) / 3.0;
      n = n * 0.5 + 0.5;
      
      // Brand Colors: Obsidian (#050505) -> Emerald (#34D399) -> Soft Teal (#10B981)
      vec3 bg = vec3(0.02, 0.02, 0.02);
      vec3 emerald = vec3(0.204, 0.827, 0.600);
      vec3 teal = vec3(0.063, 0.725, 0.506);
      
      float heroMask = smoothstep(1.0, 0.0, st.y);
      float centerGlow = exp(-length(uv * vec2(0.8, 1.2)) * 1.2);
      
      float intensity = pow(n, 2.8) * 0.4 * heroMask * (0.4 + 0.6 * centerGlow);
      vec3 color = mix(bg, emerald, intensity);
      color = mix(color, teal, pow(n, 4.0) * 0.2 * heroMask);
      
      // Subtle mouse interaction
      vec2 mouseUv = (uMouse * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
      float mouseDist = length(uv - mouseUv);
      float mouseGlow = exp(-mouseDist * mouseDist * 3.5) * 0.12 * heroMask;
      color += emerald * mouseGlow;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uMouse = gl.getUniformLocation(program, 'uMouse');

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function updateMouse(e) {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    targetMouseY = (canvas.height - (e.clientY - rect.top) * (canvas.height / rect.height));
  }

  window.addEventListener('mousemove', updateMouse);
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) updateMouse(e.touches[0]);
  }, { passive: true });

  function resize() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  let animId;
  const startTime = performance.now();

  function render(now) {
    resize();

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    gl.useProgram(program);

    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) * 0.001);
    gl.uniform2f(uMouse, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', updateMouse);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}
