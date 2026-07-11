import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heatmap, LiquidMetal } from '@paper-design/shaders-react';

const UI_LIGHT = '#111111';
const UI_DARK = '#FFFFFF';

const FRAME_PRESETS = [
  { id: 'ig-post-1350x1080', label: 'Instagram Post (1350×1080)', width: 1350, height: 1080 },
  { id: 'ig-reel-1080x1920', label: 'Instagram Reel (1080×1920)', width: 1080, height: 1920 },
  { id: 'ig-square-1080', label: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { id: '16x9-1920x1080', label: '16:9 (1920×1080)', width: 1920, height: 1080 },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const parseHex = (hex) => {
  if (!hex) return null;
  const value = hex.trim().replace('#', '');
  if (value.length === 3) {
    const r = parseInt(value[0] + value[0], 16);
    const g = parseInt(value[1] + value[1], 16);
    const b = parseInt(value[2] + value[2], 16);
    if ([r, g, b].some((x) => Number.isNaN(x))) return null;
    return { r, g, b };
  }
  if (value.length === 6) {
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    if ([r, g, b].some((x) => Number.isNaN(x))) return null;
    return { r, g, b };
  }
  return null;
};

const hexToVec3 = (hex, fallback) => {
  const rgb = parseHex(hex);
  if (!rgb) return fallback;
  return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
};

const sanitizeSvgMarkup = (raw) => {
  if (!raw) return raw;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'image/svg+xml');
    const root = doc.documentElement;
    if (!root || root.nodeName.toLowerCase() !== 'svg') return raw.replace(/add comment/gi, '');

    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const parentsToRemove = new Set();
    for (;;) {
      const node = walker.nextNode();
      if (!node) break;
      const text = (node.nodeValue || '').trim();
      if (!text) continue;
      if (/add comment/i.test(text)) {
        if (node.parentElement) parentsToRemove.add(node.parentElement);
      }
    }
    parentsToRemove.forEach((el) => el.remove());

    const serializer = new XMLSerializer();
    return serializer.serializeToString(root);
  } catch {
    return raw.replace(/add comment/gi, '');
  }
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || 'Shader compile failed');
  }
  return shader;
};

const createProgram = (gl, vsSource, fsSource) => {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) throw new Error('Shader creation failed');
  const program = gl.createProgram();
  if (!program) throw new Error('Program creation failed');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || 'Program link failed');
  }
  return program;
};

const createTextureFromImage = (gl, image) => {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
};

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_image;
uniform vec2 u_canvasSize;
uniform vec2 u_imageSize;
uniform int u_fitMode;
uniform vec2 u_pan;
uniform float u_zoom;
uniform int u_effect;
uniform float u_intensity;
uniform float u_grain;
uniform float u_shine;
uniform float u_hue;
uniform vec3 u_tint;
uniform vec3 u_bg;
uniform float u_time;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 1.0/3.0, 2.0/3.0)) * 6.0 - 3.0);
  vec3 rgb = clamp(p - 1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 hueShift(vec3 rgb, float shift) {
  vec3 hsv = rgb2hsv(rgb);
  hsv.x = fract(hsv.x + shift);
  return hsv2rgb(hsv);
}

vec2 imageUvFromCanvasUv(vec2 uv) {
  float canvasAR = u_canvasSize.x / max(1.0, u_canvasSize.y);
  float imgAR = u_imageSize.x / max(1.0, u_imageSize.y);
  float scaleX = 1.0;
  float scaleY = 1.0;

  if (u_fitMode == 0) {
    if (imgAR > canvasAR) {
      scaleY = canvasAR / imgAR;
    } else {
      scaleX = imgAR / canvasAR;
    }
  } else {
    if (imgAR > canvasAR) {
      scaleX = imgAR / canvasAR;
    } else {
      scaleY = canvasAR / imgAR;
    }
  }

  vec2 centered = uv - 0.5;
  vec2 scaled = centered / vec2(scaleX, scaleY);
  vec2 zoomed = scaled / max(0.05, u_zoom);
  return zoomed + 0.5 + u_pan;
}

void main() {
  vec2 iuv = imageUvFromCanvasUv(v_uv);
  vec4 src = vec4(0.0);
  if (iuv.x >= 0.0 && iuv.x <= 1.0 && iuv.y >= 0.0 && iuv.y <= 1.0) {
    src = texture(u_image, iuv);
  }

  vec3 base = mix(u_bg, src.rgb, src.a);
  base = hueShift(base, u_hue);

  vec3 tinted = mix(base, base * u_tint, clamp(u_intensity, 0.0, 1.0));

  if (u_effect == 1) {
    float g = fbm(v_uv * 780.0 + vec2(u_time * 0.02, u_time * 0.015));
    float fibers = fbm(v_uv * vec2(420.0, 1200.0) + vec2(11.2, 3.7));
    float grain = (g * 2.0 - 1.0) * 0.085 + (fibers * 2.0 - 1.0) * 0.04;
    float strength = clamp(u_grain, 0.0, 1.0);
    vec3 paper = tinted + grain * strength;
    paper = mix(paper, paper * vec3(0.98, 0.985, 0.99), 0.4 * strength);
    outColor = vec4(clamp(paper, 0.0, 1.0), 1.0);
    return;
  }

  if (u_effect == 2) {
    vec2 p = v_uv * 2.0 - 1.0;
    float r = length(p);
    float t = u_time * 0.35;
    float n = fbm(v_uv * 6.0 + vec2(t, -t));
    float w = fbm(v_uv * 14.0 + vec2(-t * 1.3, t * 0.9));
    float height = n * 0.75 + w * 0.25;
    float dhdx = dFdx(height);
    float dhdy = dFdy(height);
    vec3 normal = normalize(vec3(-dhdx * 6.0, -dhdy * 6.0, 1.0));

    vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    float ndl = clamp(dot(normal, lightDir), 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float ndh = clamp(dot(normal, halfDir), 0.0, 1.0);

    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);
    float specPow = mix(35.0, 120.0, clamp(u_shine, 0.0, 1.0));
    float spec = pow(ndh, specPow);
    float ripples = 0.4 + 0.6 * fbm(v_uv * 48.0 + vec2(t * 0.65, -t * 0.6));
    spec *= ripples;

    vec3 metalBase = mix(tinted, tinted * vec3(0.85, 0.9, 0.95), 0.55);
    vec3 lit = metalBase * (0.35 + 0.75 * ndl);
    vec3 highlight = vec3(1.0) * spec * (0.85 + 1.1 * fresnel);
    float vignette = smoothstep(1.08, 0.15, r);
    vec3 outRgb = mix(tinted, lit + highlight, clamp(u_intensity, 0.0, 1.0));
    outRgb = mix(outRgb, outRgb * vignette, 0.22);
    outColor = vec4(clamp(outRgb, 0.0, 1.0), 1.0);
    return;
  }

  outColor = vec4(clamp(tinted, 0.0, 1.0), 1.0);
}
`;

const createDemoCanvas = (size = 1024) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, '#1b1b1b');
  g.addColorStop(0.4, '#3b3b3b');
  g.addColorStop(1, '#f2f2f2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(size * 0.08, size * 0.12, size * 0.84, size * 0.18);
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#111111';
  ctx.font = `${Math.floor(size * 0.075)}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
  ctx.textBaseline = 'middle';
  ctx.fillText('CREATIONBASE', size * 0.11, size * 0.21);

  ctx.globalAlpha = 0.75;
  ctx.fillStyle = '#0b57ff';
  ctx.beginPath();
  ctx.arc(size * 0.22, size * 0.7, size * 0.17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff2d55';
  ctx.beginPath();
  ctx.arc(size * 0.6, size * 0.64, size * 0.23, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#10b981';
  ctx.fillRect(size * 0.18, size * 0.78, size * 0.62, size * 0.11);
  ctx.globalAlpha = 1;

  return canvas;
};

function Tools() {
  const withTimeout = useCallback((promise, ms, label) => {
    let t = 0;
    const timeoutPromise = new Promise((_, reject) => {
      t = globalThis.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
      if (t) globalThis.clearTimeout(t);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const coarse = !!window.matchMedia?.('(pointer:coarse)')?.matches;
    return coarse || /iPhone|iPad|iPod|Android/i.test(ua);
  }, []);

  const isIOSDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod/i.test(ua);
  }, []);

  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const vaoRef = useRef(null);
  const texRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(0);
  const lastUrlRef = useRef('');
  const lastTimeRef = useRef(performance.now());
  const timeAccRef = useRef(0);
  const forcePixelRatioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordTimeoutRef = useRef(0);
  const recordIntervalRef = useRef(0);
  const recordChunksRef = useRef([]);
  const iosReadPixelsRef = useRef(null);
  const iosImageDataRef = useRef(null);
  const recordCanvasElRef = useRef(null);
  const recordFboRef = useRef(null);
  const recordFboTexRef = useRef(null);
  const recordFboSizeRef = useRef({ w: 0, h: 0 });
  const ffmpegRef = useRef(null);
  const ffmpegLoadingRef = useRef(null);
  const saveFileHandleRef = useRef(null);
  const lastAutoDownloadUrlRef = useRef('');
  const prevAnimateRef = useRef(true);
  const paperPreviewMountRef = useRef(null);
  const paperExportMountRef = useRef(null);
  const [paperExportActive, setPaperExportActive] = useState(false);
  const [paperImageUrl, setPaperImageUrl] = useState('/images/creationbase logo new png.webp');

  const [framePresetId, setFramePresetId] = useState(FRAME_PRESETS[0].id);
  const preset = useMemo(() => FRAME_PRESETS.find((p) => p.id === framePresetId) || FRAME_PRESETS[0], [framePresetId]);
  const [customW, setCustomW] = useState(preset.width);
  const [customH, setCustomH] = useState(preset.height);
  const [useCustomFrame, setUseCustomFrame] = useState(false);

  const frameW = useCustomFrame ? clamp(customW || preset.width, 64, 4096) : preset.width;
  const frameH = useCustomFrame ? clamp(customH || preset.height, 64, 4096) : preset.height;

  const [fitMode, setFitMode] = useState('contain');
  const [effect, setEffect] = useState('liquid-metal');
  const [intensity, setIntensity] = useState(0.85);
  const [grain, setGrain] = useState(0.55);
  const [shine, setShine] = useState(0.75);
  const [hue, setHue] = useState(0);
  const [tintHex, setTintHex] = useState('#d7d7d7');
  const [bgHex, setBgHex] = useState('#ffffff');
  const [zoom, setZoom] = useState(0.75);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paperSpeed, setPaperSpeed] = useState(1);
  const [paperScale, setPaperScale] = useState(0.65);
  const [paperRotation, setPaperRotation] = useState(0);
  const [paperOffsetX, setPaperOffsetX] = useState(0);
  const [paperOffsetY, setPaperOffsetY] = useState(0);
  const [lmRepetition, setLmRepetition] = useState(2);
  const [lmSoftness, setLmSoftness] = useState(0.1);
  const [lmShiftRed, setLmShiftRed] = useState(0.3);
  const [lmShiftBlue, setLmShiftBlue] = useState(0.3);
  const [lmDistortion, setLmDistortion] = useState(0.07);
  const [lmContour, setLmContour] = useState(0.4);
  const [lmAngle, setLmAngle] = useState(70);
  const [hmContour, setHmContour] = useState(0.5);
  const [hmNoise, setHmNoise] = useState(0);
  const [hmInnerGlow, setHmInnerGlow] = useState(0.5);
  const [hmOuterGlow, setHmOuterGlow] = useState(0.5);
  const [hmAngle, setHmAngle] = useState(0);
  const [hmColors, setHmColors] = useState([
    '#112069',
    '#1f3ca3',
    '#3265e7',
    '#6bd8ff',
    '#ffe77a',
    '#ff9a1f',
    '#ff4d00',
  ]);
  const isPaperLiquidMetal = effect === 'liquid-metal';
  const isPaperHeatmap = effect === 'heatmap';
  const isPaperShader = isPaperLiquidMetal || isPaperHeatmap;
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoFps, setVideoFps] = useState(30);
  const [isRecording, setIsRecording] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mp4Download, setMp4Download] = useState(null);
  const [stackLayout, setStackLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 980px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const onChange = (ev) => setStackLayout(ev.matches);
    setStackLayout(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const uniformLocationsRef = useRef(null);

  const initGlIfNeeded = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const existing = glRef.current;
    if (existing && programRef.current && vaoRef.current) return existing;

    setStatusMessage('');
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) {
      setStatusMessage('WebGL2 is not available in this browser.');
      return null;
    }
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    if (!vao || !vbo) {
      gl.deleteProgram(program);
      setStatusMessage('WebGL init failed.');
      return null;
    }
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const uniforms = {
      u_image: gl.getUniformLocation(program, 'u_image'),
      u_canvasSize: gl.getUniformLocation(program, 'u_canvasSize'),
      u_imageSize: gl.getUniformLocation(program, 'u_imageSize'),
      u_fitMode: gl.getUniformLocation(program, 'u_fitMode'),
      u_pan: gl.getUniformLocation(program, 'u_pan'),
      u_zoom: gl.getUniformLocation(program, 'u_zoom'),
      u_effect: gl.getUniformLocation(program, 'u_effect'),
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_grain: gl.getUniformLocation(program, 'u_grain'),
      u_shine: gl.getUniformLocation(program, 'u_shine'),
      u_hue: gl.getUniformLocation(program, 'u_hue'),
      u_tint: gl.getUniformLocation(program, 'u_tint'),
      u_bg: gl.getUniformLocation(program, 'u_bg'),
      u_time: gl.getUniformLocation(program, 'u_time'),
    };

    glRef.current = gl;
    programRef.current = program;
    vaoRef.current = vao;
    uniformLocationsRef.current = uniforms;
    return gl;
  };

  const ensureDemoTexture = useCallback((gl) => {
    if (texRef.current && sourceRef.current) return;
    const demo = createDemoCanvas(1024);
    sourceRef.current = demo;
    texRef.current = createTextureFromImage(gl, demo);
  }, []);

  const destroyTexture = () => {
    const gl = glRef.current;
    if (!gl) return;
    if (texRef.current) {
      gl.deleteTexture(texRef.current);
      texRef.current = null;
    }
  };

  const loadImageFromFile = async (file) => {
    if (!file) return;
    destroyTexture();
    sourceRef.current = null;
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    const isSvg = file.type === 'image/svg+xml' || String(file.name || '').toLowerCase().endsWith('.svg');
    let blobForUrl = file;
    if (isSvg) {
      const raw = await file.text();
      const cleaned = sanitizeSvgMarkup(raw);
      blobForUrl = new Blob([cleaned], { type: 'image/svg+xml' });
    }
    lastUrlRef.current = URL.createObjectURL(blobForUrl);
    const url = lastUrlRef.current;
    setPaperImageUrl(url);
    const img = new Image();
    img.decoding = 'async';
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    sourceRef.current = img;
    const gl = initGlIfNeeded();
    if (!gl) return;
    texRef.current = createTextureFromImage(gl, img);
    setStatusMessage('');
  };

  const setCanvasDrawingBuffer = (gl, width, height, pixelRatio) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = clamp(pixelRatio, 1, 2);
    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  };

  const render = useCallback((options) => {
    const gl = initGlIfNeeded();
    if (!gl || !programRef.current || !vaoRef.current) return;
    const source = sourceRef.current;
    const tex = texRef.current;

    if (!tex || !source) ensureDemoTexture(gl);
    const nextSource = sourceRef.current;
    const nextTex = texRef.current;

    const forcedPixelRatio = forcePixelRatioRef.current;
    const pixelRatio = options?.pixelRatio ?? (forcedPixelRatio ?? Math.min(window.devicePixelRatio || 1, 2));
    const canvasW = options?.width ?? frameW;
    const canvasH = options?.height ?? frameH;
    const targetFramebuffer = options?.framebuffer ?? null;
    if (targetFramebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, targetFramebuffer);
      gl.viewport(0, 0, Math.max(1, Math.round(canvasW)), Math.max(1, Math.round(canvasH)));
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      setCanvasDrawingBuffer(gl, canvasW, canvasH, pixelRatio);
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(programRef.current);
    gl.bindVertexArray(vaoRef.current);

    const uniforms = uniformLocationsRef.current;
    if (!uniforms) return;
    gl.uniform2f(uniforms.u_canvasSize, canvasW, canvasH);
    if (nextSource && nextTex) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, nextTex);
      gl.uniform1i(uniforms.u_image, 0);
      gl.uniform2f(uniforms.u_imageSize, nextSource.width || 1, nextSource.height || 1);
    } else {
      gl.uniform2f(uniforms.u_imageSize, 1, 1);
    }

    gl.uniform1i(uniforms.u_fitMode, fitMode === 'cover' ? 1 : 0);
    gl.uniform2f(uniforms.u_pan, panX, panY);
    gl.uniform1f(uniforms.u_zoom, zoom);
    gl.uniform1i(uniforms.u_effect, effect === 'legacy-paper' ? 1 : effect === 'legacy-liquid-metal' ? 2 : 0);
    gl.uniform1f(uniforms.u_intensity, intensity);
    gl.uniform1f(uniforms.u_grain, grain);
    gl.uniform1f(uniforms.u_shine, shine);
    gl.uniform1f(uniforms.u_hue, hue);
    gl.uniform3fv(uniforms.u_tint, hexToVec3(tintHex, [1, 1, 1]));
    gl.uniform3fv(uniforms.u_bg, hexToVec3(bgHex, [1, 1, 1]));
    gl.uniform1f(uniforms.u_time, timeAccRef.current);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }, [bgHex, effect, ensureDemoTexture, fitMode, frameH, frameW, grain, hue, intensity, panX, panY, shine, tintHex, zoom]);

  const scheduleRender = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => render());
  }, [render]);

  useEffect(() => {
    if (!String(effect).startsWith('legacy-')) return;
    scheduleRender();
    return () => cancelAnimationFrame(rafRef.current);
  }, [effect, scheduleRender]);

  useEffect(() => {
    if (!String(effect).startsWith('legacy-')) return;
    if (!animate) return;
    let mounted = true;
    const tick = (now) => {
      if (!mounted) return;
      const dt = Math.min(40, Math.max(0, now - lastTimeRef.current));
      lastTimeRef.current = now;
      timeAccRef.current += dt / 1000;
      render();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, effect, render]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = '';
      if (recordTimeoutRef.current) window.clearTimeout(recordTimeoutRef.current);
      if (recordCanvasElRef.current) {
        try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
        recordCanvasElRef.current = null;
      }
      const gl = glRef.current;
      if (gl) {
        if (recordFboRef.current) {
          try { gl.deleteFramebuffer(recordFboRef.current); } catch (e) { void e; }
          recordFboRef.current = null;
        }
        if (recordFboTexRef.current) {
          try { gl.deleteTexture(recordFboTexRef.current); } catch (e) { void e; }
          recordFboTexRef.current = null;
        }
      }
    };
  }, []);

  const waitForCanvasIn = useCallback(async (getMountEl, timeoutMs = 2500) => {
    const start = performance.now();
    for (;;) {
      const mountEl = typeof getMountEl === 'function' ? getMountEl() : getMountEl;
      const canvas = mountEl ? mountEl.querySelector('canvas') : null;
      if (canvas) return canvas;
      if (performance.now() - start > timeoutMs) return null;
      await new Promise((r) => requestAnimationFrame(() => r()));
    }
  }, []);

  const pickVideoMime = useCallback(() => {
    if (typeof MediaRecorder === 'undefined') return { mimeType: '', ext: 'mp4' };
    const isSupported = (t) => t && MediaRecorder.isTypeSupported(t);

    const mp4Candidates = [
      'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
      'video/mp4;codecs="avc1.4D401E,mp4a.40.2"',
      'video/mp4;codecs="avc1"',
      'video/mp4',
    ];
    const webmCandidates = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];

    const mp4 = mp4Candidates.find(isSupported);
    if (mp4) return { mimeType: mp4, needsTranscode: isIOSDevice };
    const webm = webmCandidates.find(isSupported) || '';
    return { mimeType: webm, needsTranscode: true };
  }, [isIOSDevice]);

  const getFfmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    if (ffmpegLoadingRef.current) return ffmpegLoadingRef.current;

    ffmpegLoadingRef.current = (async () => {
      const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
        import('@ffmpeg/ffmpeg'),
        import('@ffmpeg/util'),
      ]);

      const ffmpeg = new FFmpeg();
      const bases = [
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd',
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist',
      ];
      let loaded = false;
      let lastError = null;
      for (const base of bases) {
        try {
          const coreURL = await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript');
          const wasmURL = await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm');
          let workerURL = '';
          try {
            workerURL = await toBlobURL(`${base}/ffmpeg-core.worker.js`, 'text/javascript');
          } catch (e) {
            void e;
          }
          await ffmpeg.load(workerURL ? { coreURL, wasmURL, workerURL } : { coreURL, wasmURL });
          loaded = true;
          lastError = null;
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (!loaded) throw (lastError instanceof Error ? lastError : new Error('FFmpeg failed to load'));

      ffmpegRef.current = { ffmpeg, fetchFile };
      return ffmpegRef.current;
    })();

    return ffmpegLoadingRef.current;
  }, []);

  const requestSaveFileHandle = useCallback(async (filename) => {
    if (typeof window === 'undefined') return null;
    if (isMobileDevice) return null;
    const picker = window.showSaveFilePicker;
    if (typeof picker !== 'function') return null;
    try {
      return await picker({
        suggestedName: filename,
        types: [
          {
            description: 'MP4 Video',
            accept: { 'video/mp4': ['.mp4'] },
          },
        ],
      });
    } catch (e) {
      void e;
      return null;
    }
  }, [isMobileDevice]);

  const writeFileHandle = useCallback(async (handle, blob) => {
    if (!handle) return false;
    try {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (e) {
      void e;
      return false;
    }
  }, []);

  const encodeMp4 = useCallback(async (inputBlob, inputExt) => {
    const { ffmpeg, fetchFile } = await withTimeout(getFfmpeg(), 60000, 'FFmpeg load');
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const inputName = `in-${id}.${inputExt}`;
    const outputName = `out-${id}.mp4`;
    await ffmpeg.writeFile(inputName, await fetchFile(inputBlob));
    try {
      try {
        await withTimeout(
          ffmpeg.exec(['-i', inputName, '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-profile:v', 'baseline', '-level', '4.0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputName]),
          120000,
          'MP4 encode',
        );
      } catch {
        await withTimeout(
          ffmpeg.exec(['-i', inputName, '-an', '-c:v', 'mpeg4', '-q:v', '3', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputName]),
          120000,
          'MP4 encode',
        );
      }
      const data = await withTimeout(ffmpeg.readFile(outputName), 20000, 'MP4 read');
      return new Blob([data], { type: 'video/mp4' });
    } finally {
      try { await ffmpeg.deleteFile(inputName); } catch (e) { void e; }
      try { await ffmpeg.deleteFile(outputName); } catch (e) { void e; }
    }
  }, [getFfmpeg, withTimeout]);

  const setMp4DownloadFromBlob = useCallback((blob, filename) => {
    setMp4Download((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(blob), filename, blob };
    });
  }, []);

  const clearMp4Download = useCallback(() => {
    setMp4Download((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  useEffect(() => () => {
    if (mp4Download?.url) URL.revokeObjectURL(mp4Download.url);
  }, [mp4Download]);

  const downloadFromUrl = useCallback((url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const openUrl = useCallback((url) => {
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) window.location.assign(url);
  }, []);

  const shareMp4 = useCallback(async () => {
    if (!mp4Download?.blob) return;
    if (!navigator.share) {
      openUrl(mp4Download.url);
      return;
    }
    const fileType = mp4Download.blob.type || 'video/mp4';
    const file = new File([mp4Download.blob], mp4Download.filename, { type: fileType });
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      openUrl(mp4Download.url);
      return;
    }
    try {
      await navigator.share({ files: [file], title: 'MATERIAL LAB' });
    } catch (e) {
      void e;
      openUrl(mp4Download.url);
    }
  }, [mp4Download, openUrl]);

  const saveMp4 = useCallback(async () => {
    if (!mp4Download?.url) return;
    if (isMobileDevice) {
      await shareMp4();
      return;
    }
    downloadFromUrl(mp4Download.url, mp4Download.filename);
  }, [downloadFromUrl, isMobileDevice, mp4Download, shareMp4]);

  useEffect(() => {
    if (!mp4Download?.url) return;
    if (isMobileDevice) return;
    if (lastAutoDownloadUrlRef.current === mp4Download.url) return;
    lastAutoDownloadUrlRef.current = mp4Download.url;
    downloadFromUrl(mp4Download.url, mp4Download.filename);
  }, [downloadFromUrl, isMobileDevice, mp4Download]);

  const downloadPng = useCallback(async () => {
    if (isPaperShader) {
      setStatusMessage('Preparing export…');
      setPaperExportActive(true);
      await new Promise((r) => requestAnimationFrame(() => r()));
      const shaderCanvas = await waitForCanvasIn(() => paperExportMountRef.current);
      const out = document.createElement('canvas');
      out.width = frameW;
      out.height = frameH;
      const ctx = out.getContext('2d');
      if (!ctx || !shaderCanvas) {
        setStatusMessage('Export failed (canvas not ready).');
        setPaperExportActive(false);
        return;
      }
      ctx.clearRect(0, 0, frameW, frameH);
      ctx.drawImage(shaderCanvas, 0, 0, frameW, frameH);
      const url = out.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `creationbase-tools-${frameW}x${frameH}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setPaperExportActive(false);
      setStatusMessage('');
      return;
    }

    render({ width: frameW, height: frameH, pixelRatio: 1 });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `creationbase-tools-${frameW}x${frameH}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    scheduleRender();
  }, [frameH, frameW, isPaperShader, render, scheduleRender, waitForCanvasIn]);

  const stopRecording = useCallback(() => {
    if (recordTimeoutRef.current) {
      window.clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = 0;
    }
    if (recordIntervalRef.current) {
      window.clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = 0;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') return;
    setIsFinalizing(true);
    setStatusMessage('Finalizing…');
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording' && typeof rec.requestData === 'function') {
      try {
        rec.requestData();
      } catch (e) {
        void e;
      }
    }
    if (rec && rec.state !== 'inactive') rec.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || isFinalizing) return;
    if (typeof MediaRecorder === 'undefined' && !isIOSDevice) {
      setStatusMessage('Video export is not supported in this browser (MediaRecorder unavailable).');
      return;
    }
    clearMp4Download();
    saveFileHandleRef.current = null;
    setIsFinalizing(false);

    const { mimeType, needsTranscode } = pickVideoMime();
    if (!mimeType) {
      setStatusMessage('Video export is not supported in this browser.');
      return;
    }
    const ext = 'mp4';
    const outFilename = `creationbase-tools-${frameW}x${frameH}-${videoDuration}s.${ext}`;
    const extraStopMs = isIOSDevice ? 1100 : 0;

    if (!isMobileDevice) {
      const handle = await requestSaveFileHandle(outFilename);
      if (handle) saveFileHandleRef.current = handle;
    }

    if (isPaperShader) {
      setStatusMessage('Preparing recording…');
      const usePreviewCanvas = isIOSDevice;
      if (!usePreviewCanvas) {
        setPaperExportActive(true);
      }
      await new Promise((r) => requestAnimationFrame(() => r()));
      const shaderCanvas = await waitForCanvasIn(() => (usePreviewCanvas ? paperPreviewMountRef.current : paperExportMountRef.current));
      if (!shaderCanvas) {
        setStatusMessage('Recording failed (canvas not ready).');
        setPaperExportActive(false);
        return;
      }

      const out = document.createElement('canvas');
      out.width = frameW;
      out.height = frameH;
      out.style.position = 'fixed';
      out.style.left = '-10000px';
      out.style.top = '0';
      out.style.width = `${frameW}px`;
      out.style.height = `${frameH}px`;
      out.style.opacity = '0';
      out.style.pointerEvents = 'none';
      out.setAttribute('aria-hidden', 'true');
      document.body.appendChild(out);
      recordCanvasElRef.current = out;
      const ctx = out.getContext('2d');
      if (!ctx) {
        setStatusMessage('Recording failed (2D context unavailable).');
        try { out.remove(); } catch (e) { void e; }
        if (recordCanvasElRef.current === out) recordCanvasElRef.current = null;
        setPaperExportActive(false);
        return;
      }

      if (isIOSDevice) {
        const maxFrames = 180;
        const fps = Math.max(6, Math.min(videoFps, Math.floor(maxFrames / Math.max(1, videoDuration))));
        const totalFrames = Math.max(1, Math.round(videoDuration * fps));
        const pad = (n) => String(n).padStart(5, '0');
        const canvasToPng = () => new Promise((resolve) => {
          out.toBlob((b) => resolve(b), 'image/png');
        });
        const mount = paperExportMountRef.current?.paperShaderMount;

        const glPaper = shaderCanvas.getContext('webgl2') || shaderCanvas.getContext('webgl');
        const captureW2 = Math.max(1, glPaper?.drawingBufferWidth || shaderCanvas.width || frameW);
        const captureH2 = Math.max(1, glPaper?.drawingBufferHeight || shaderCanvas.height || frameH);
        const expectedLen = captureW2 * captureH2 * 4;
        const pixels = new Uint8Array(expectedLen);

        const tmp = document.createElement('canvas');
        tmp.width = captureW2;
        tmp.height = captureH2;
        const tmpCtx = tmp.getContext('2d');
        const imageData = tmpCtx ? tmpCtx.createImageData(captureW2, captureH2) : ctx.createImageData(captureW2, captureH2);

        setIsRecording(true);
        setIsFinalizing(true);
        try {
          setStatusMessage(`Preparing frames… (${fps}fps)`);
          const { ffmpeg, fetchFile } = await withTimeout(getFfmpeg(), 60000, 'FFmpeg load');

          for (let i = 0; i < totalFrames; i += 1) {
            if (i % 12 === 0) setStatusMessage(`Preparing frames… ${i}/${totalFrames}`);
            await new Promise((r) => requestAnimationFrame(() => r()));
            await new Promise((r) => requestAnimationFrame(() => r()));

            ctx.clearRect(0, 0, frameW, frameH);
            ctx.fillStyle = bgHex || (isPaperHeatmap ? '#000000' : '#FFFFFF');
            ctx.fillRect(0, 0, frameW, frameH);

            if (glPaper) {
              try { glPaper.finish(); } catch (e) { void e; }
              try {
                glPaper.readPixels(0, 0, captureW2, captureH2, glPaper.RGBA, glPaper.UNSIGNED_BYTE, pixels);
                let hasNonZero = false;
                for (let k = 0; k < pixels.length; k += 16384) {
                  if (pixels[k] || pixels[k + 1] || pixels[k + 2] || pixels[k + 3]) { hasNonZero = true; break; }
                }
                if (hasNonZero) {
                  const rowBytes = captureW2 * 4;
                  for (let y = 0; y < captureH2; y += 1) {
                    const srcStart = (captureH2 - 1 - y) * rowBytes;
                    const dstStart = y * rowBytes;
                    imageData.data.set(pixels.subarray(srcStart, srcStart + rowBytes), dstStart);
                  }
                  if (tmpCtx) tmpCtx.putImageData(imageData, 0, 0);
                  ctx.drawImage(tmp, 0, 0);
                } else {
                  try { ctx.drawImage(shaderCanvas, 0, 0); } catch (err) { void err; }
                }
              } catch (e) {
                void e;
                try { ctx.drawImage(shaderCanvas, 0, 0); } catch (err) { void err; }
              }
            } else {
              try { ctx.drawImage(shaderCanvas, 0, 0); } catch (e) { void e; }
            }

            const pngBlob = await canvasToPng();
            if (!pngBlob) throw new Error('Frame encode failed');
            await ffmpeg.writeFile(`frame-${pad(i)}.png`, await fetchFile(pngBlob));
          }

          setStatusMessage('Encoding MP4…');
          const outputName = `out-ios-paper-${Date.now()}.mp4`;
          await withTimeout(
            ffmpeg.exec([
              '-framerate', String(fps),
              '-start_number', '0',
              '-i', 'frame-%05d.png',
              '-an',
              '-c:v', 'libx264',
              '-preset', 'veryfast',
              '-crf', '23',
              '-profile:v', 'baseline',
              '-level', '4.0',
              '-pix_fmt', 'yuv420p',
              '-movflags', '+faststart',
              outputName,
            ]),
            180000,
            'MP4 encode',
          );
          const bytes = await withTimeout(ffmpeg.readFile(outputName), 20000, 'MP4 read');
          const mp4 = new Blob([bytes], { type: 'video/mp4' });
          for (let i = 0; i < totalFrames; i += 1) {
            try { await ffmpeg.deleteFile(`frame-${pad(i)}.png`); } catch (e) { void e; }
          }
          try { await ffmpeg.deleteFile(outputName); } catch (e) { void e; }
          setMp4DownloadFromBlob(mp4, outFilename);
          setStatusMessage('MP4 ready.');
        } catch {
          setStatusMessage('MP4 encoding failed.');
        } finally {
          if (recordCanvasElRef.current) {
            try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
            recordCanvasElRef.current = null;
          }
          setIsRecording(false);
          setIsFinalizing(false);
          setPaperExportActive(false);
        }
        return;
      }

      const fps = Math.max(10, Math.min(60, videoFps));
      const baseFill = bgHex || (isPaperHeatmap ? '#000000' : '#FFFFFF');
      const draw = () => {
        ctx.fillStyle = baseFill;
        ctx.fillRect(0, 0, frameW, frameH);
        ctx.drawImage(shaderCanvas, 0, 0, frameW, frameH);
      };
      draw();
      recordIntervalRef.current = window.setInterval(draw, Math.round(1000 / fps));

      await new Promise((r) => requestAnimationFrame(() => r()));
      await new Promise((r) => requestAnimationFrame(() => r()));
      await new Promise((r) => globalThis.setTimeout(r, Math.round(1000 / fps)));
      draw();

      const stream = out.captureStream(fps);
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recordChunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) recordChunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        if (recordIntervalRef.current) {
          window.clearInterval(recordIntervalRef.current);
          recordIntervalRef.current = 0;
        }
        if (recordCanvasElRef.current) {
          try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
          recordCanvasElRef.current = null;
        }
        const blobType = recorder.mimeType || mimeType || '';
        const inputExt = String(blobType).includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(recordChunksRef.current, { type: blobType || 'video/webm' });
        try {
          if (needsTranscode || !String(blobType).startsWith('video/mp4')) {
            setStatusMessage('Encoding MP4…');
            const mp4 = await encodeMp4(blob, inputExt);
            const handle = saveFileHandleRef.current;
            saveFileHandleRef.current = null;
            if (handle && await writeFileHandle(handle, mp4)) {
              setStatusMessage('Saved.');
              clearMp4Download();
            } else {
              setMp4DownloadFromBlob(mp4, outFilename);
              setStatusMessage('MP4 ready.');
            }
          } else {
            const handle = saveFileHandleRef.current;
            saveFileHandleRef.current = null;
            if (handle && await writeFileHandle(handle, blob)) {
              setStatusMessage('Saved.');
              clearMp4Download();
            } else {
              setMp4DownloadFromBlob(blob, outFilename);
              setStatusMessage('MP4 ready.');
            }
          }
        } catch {
          const handle = saveFileHandleRef.current;
          saveFileHandleRef.current = null;
          if (handle && await writeFileHandle(handle, blob)) {
            setStatusMessage('Saved.');
            clearMp4Download();
          } else {
            setMp4DownloadFromBlob(blob, outFilename);
            setStatusMessage('MP4 ready.');
          }
        } finally {
          recordChunksRef.current = [];
          mediaRecorderRef.current = null;
          setIsRecording(false);
          setPaperExportActive(false);
          setIsFinalizing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsFinalizing(false);
      setStatusMessage(`Recording ${videoDuration}s video…`);
      recorder.start(250);
      recordTimeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, Math.max(1, videoDuration) * 1000 + extraStopMs);
      return;
    }

    if (isIOSDevice) {
      const gl = initGlIfNeeded();
      if (!gl) {
        setStatusMessage('WebGL init failed.');
        return;
      }

      forcePixelRatioRef.current = 1;

      const maxFrames = 300;
      const fps = Math.max(10, Math.min(videoFps, Math.floor(maxFrames / Math.max(1, videoDuration))));
      const totalFrames = Math.max(1, Math.round(videoDuration * fps));

      if (!recordFboRef.current || recordFboSizeRef.current.w !== frameW || recordFboSizeRef.current.h !== frameH) {
        if (recordFboRef.current) {
          try { gl.deleteFramebuffer(recordFboRef.current); } catch (e) { void e; }
          recordFboRef.current = null;
        }
        if (recordFboTexRef.current) {
          try { gl.deleteTexture(recordFboTexRef.current); } catch (e) { void e; }
          recordFboTexRef.current = null;
        }

        const tex = gl.createTexture();
        const fbo = gl.createFramebuffer();
        if (!tex || !fbo) {
          if (tex) try { gl.deleteTexture(tex); } catch (e) { void e; }
          if (fbo) try { gl.deleteFramebuffer(fbo); } catch (e) { void e; }
          setStatusMessage('Recording failed (framebuffer unavailable).');
          return;
        }

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameW, frameH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (!ok) {
          try { gl.deleteTexture(tex); } catch (e) { void e; }
          try { gl.deleteFramebuffer(fbo); } catch (e) { void e; }
          setStatusMessage('Recording failed (framebuffer incomplete).');
          return;
        }

        recordFboRef.current = fbo;
        recordFboTexRef.current = tex;
        recordFboSizeRef.current = { w: frameW, h: frameH };
      }

      const out = document.createElement('canvas');
      out.width = frameW;
      out.height = frameH;
      out.style.position = 'fixed';
      out.style.left = '-10000px';
      out.style.top = '0';
      out.style.width = `${frameW}px`;
      out.style.height = `${frameH}px`;
      out.style.opacity = '0';
      out.style.pointerEvents = 'none';
      out.setAttribute('aria-hidden', 'true');
      document.body.appendChild(out);
      recordCanvasElRef.current = out;
      const ctx = out.getContext('2d');
      if (!ctx) {
        setStatusMessage('Recording failed (2D context unavailable).');
        try { out.remove(); } catch (e) { void e; }
        if (recordCanvasElRef.current === out) recordCanvasElRef.current = null;
        return;
      }

      const expectedLen = frameW * frameH * 4;
      if (!iosReadPixelsRef.current || iosReadPixelsRef.current.length !== expectedLen) {
        iosReadPixelsRef.current = new Uint8Array(expectedLen);
      }
      if (!iosImageDataRef.current || iosImageDataRef.current.width !== frameW || iosImageDataRef.current.height !== frameH) {
        iosImageDataRef.current = ctx.createImageData(frameW, frameH);
      }

      setIsRecording(true);
      setIsFinalizing(true);

      const pad = (n) => String(n).padStart(5, '0');
      const canvasToPng = () => new Promise((resolve) => {
        out.toBlob((b) => resolve(b), 'image/png');
      });

      const prevTime = timeAccRef.current;
      try {
        setStatusMessage(`Preparing frames… (${fps}fps)`);
        const { ffmpeg, fetchFile } = await withTimeout(getFfmpeg(), 60000, 'FFmpeg load');
        for (let i = 0; i < totalFrames; i += 1) {
          if (i % 20 === 0) setStatusMessage(`Preparing frames… ${i}/${totalFrames}`);
          timeAccRef.current = prevTime + i / fps;
          render({ width: frameW, height: frameH, pixelRatio: 1, framebuffer: recordFboRef.current });
          try { gl.finish(); } catch (e) { void e; }
          gl.bindFramebuffer(gl.FRAMEBUFFER, recordFboRef.current);
          gl.readPixels(0, 0, frameW, frameH, gl.RGBA, gl.UNSIGNED_BYTE, iosReadPixelsRef.current);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);

          const src = iosReadPixelsRef.current;
          let hasNonZero = false;
          for (let k = 0; k < src.length; k += 16384) {
            if (src[k] || src[k + 1] || src[k + 2] || src[k + 3]) { hasNonZero = true; break; }
          }
          if (hasNonZero) {
            const dst = iosImageDataRef.current.data;
            const rowBytes = frameW * 4;
            for (let y = 0; y < frameH; y += 1) {
              const srcStart = (frameH - 1 - y) * rowBytes;
              const dstStart = y * rowBytes;
              dst.set(src.subarray(srcStart, srcStart + rowBytes), dstStart);
            }
            for (let p = 3; p < dst.length; p += 4) dst[p] = 255;
            ctx.putImageData(iosImageDataRef.current, 0, 0);
          } else {
            ctx.fillStyle = bgHex || '#FFFFFF';
            ctx.fillRect(0, 0, frameW, frameH);
          }

          const pngBlob = await canvasToPng();
          if (!pngBlob) throw new Error('Frame encode failed');
          const data = await fetchFile(pngBlob);
          await ffmpeg.writeFile(`frame-${pad(i)}.png`, data);
        }

        setStatusMessage('Encoding MP4…');
        const outputName = `out-ios-${Date.now()}.mp4`;
        await withTimeout(
          ffmpeg.exec([
            '-framerate', String(fps),
            '-start_number', '0',
            '-i', 'frame-%05d.png',
            '-an',
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '23',
            '-profile:v', 'baseline',
            '-level', '4.0',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            outputName,
          ]),
          180000,
          'MP4 encode',
        );
        const bytes = await withTimeout(ffmpeg.readFile(outputName), 20000, 'MP4 read');
        const mp4 = new Blob([bytes], { type: 'video/mp4' });
        for (let i = 0; i < totalFrames; i += 1) {
          try { await ffmpeg.deleteFile(`frame-${pad(i)}.png`); } catch (e) { void e; }
        }
        try { await ffmpeg.deleteFile(outputName); } catch (e) { void e; }
        setMp4DownloadFromBlob(mp4, outFilename);
        setStatusMessage('MP4 ready.');
      } catch {
        setStatusMessage('MP4 encoding failed.');
      } finally {
        timeAccRef.current = prevTime;
        if (recordCanvasElRef.current) {
          try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
          recordCanvasElRef.current = null;
        }
        forcePixelRatioRef.current = null;
        setIsRecording(false);
        setIsFinalizing(false);
        scheduleRender();
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    prevAnimateRef.current = animate;
    if (!animate) setAnimate(true);
    forcePixelRatioRef.current = 1;
    render({ width: frameW, height: frameH, pixelRatio: 1 });
    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => requestAnimationFrame(() => r()));

    const stream = canvas.captureStream(Math.max(10, Math.min(60, videoFps)));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    recordChunksRef.current = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) recordChunksRef.current.push(ev.data);
    };
    recorder.onstop = async () => {
      const blobType = recorder.mimeType || mimeType || '';
      const inputExt = String(blobType).includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(recordChunksRef.current, { type: blobType || 'video/webm' });
      try {
        if (needsTranscode || !String(blobType).startsWith('video/mp4')) {
          setStatusMessage('Encoding MP4…');
          const mp4 = await encodeMp4(blob, inputExt);
          const handle = saveFileHandleRef.current;
          saveFileHandleRef.current = null;
          if (handle && await writeFileHandle(handle, mp4)) {
            setStatusMessage('Saved.');
            clearMp4Download();
          } else {
            setMp4DownloadFromBlob(mp4, outFilename);
            setStatusMessage('MP4 ready.');
          }
        } else {
          const handle = saveFileHandleRef.current;
          saveFileHandleRef.current = null;
          if (handle && await writeFileHandle(handle, blob)) {
            setStatusMessage('Saved.');
            clearMp4Download();
          } else {
            setMp4DownloadFromBlob(blob, outFilename);
            setStatusMessage('MP4 ready.');
          }
        }
      } catch {
        const handle = saveFileHandleRef.current;
        saveFileHandleRef.current = null;
        if (handle && await writeFileHandle(handle, blob)) {
          setStatusMessage('Saved.');
          clearMp4Download();
        } else {
          setMp4DownloadFromBlob(blob, outFilename);
          setStatusMessage('MP4 ready.');
        }
      } finally {
        recordChunksRef.current = [];
        mediaRecorderRef.current = null;
        forcePixelRatioRef.current = null;
        setIsRecording(false);
        setIsFinalizing(false);
        if (!prevAnimateRef.current) setAnimate(false);
        scheduleRender();
      }
    };

    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setIsFinalizing(false);
    setStatusMessage(`Recording ${videoDuration}s video…`);
    recorder.start(250);

    recordTimeoutRef.current = window.setTimeout(() => {
      stopRecording();
    }, Math.max(1, videoDuration) * 1000 + extraStopMs);
  }, [animate, bgHex, clearMp4Download, encodeMp4, frameH, frameW, isFinalizing, isIOSDevice, isMobileDevice, isPaperHeatmap, isPaperShader, isRecording, pickVideoMime, render, requestSaveFileHandle, scheduleRender, setMp4DownloadFromBlob, stopRecording, videoDuration, videoFps, waitForCanvasIn, writeFileHandle]);

  const pageBg = UI_DARK;
  const pageFg = UI_LIGHT;
  const fieldBaseStyle = useMemo(() => ({
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '10px 10px',
    borderRadius: 10,
    border: '1px solid rgba(17, 17, 17, 0.18)',
    background: '#FFFFFF',
    color: '#111111',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--font-mono-weight)',
    fontSize: 'var(--fs-sm)',
    lineHeight: 1.1,
    letterSpacing: '0.02em',
  }), []);
  const rangeStyle = useMemo(() => ({ width: '100%', minWidth: 0 }), []);
  const layoutColumns = stackLayout ? '1fr' : 'minmax(280px, 420px) minmax(0, 1fr)';
  const sidePanelMaxHeight = stackLayout ? 'none' : 'calc(var(--vh-stable, 100vh) - 160px)';
  const isLegacyShader = String(effect).startsWith('legacy-');
  const demoMaskUrl = '/images/isometric-city-blue.svg';
  const paperImage = paperImageUrl || demoMaskUrl;
  const computedPaperSpeed = animate ? paperSpeed : 0;
  const heatmapColors = hmColors;

  const renderPaperShader = (mode) => {
    const common = {
      fit: fitMode,
      scale: paperScale,
      rotation: paperRotation,
      offsetX: paperOffsetX,
      offsetY: paperOffsetY,
      speed: computedPaperSpeed,
    };
    const webGlContextAttributes = isIOSDevice ? { preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: false } : undefined;
    const sizing = mode === 'export'
      ? { width: frameW, height: frameH, minPixelRatio: 1, maxPixelCount: Math.max(1, frameW * frameH * 4) }
      : { style: { width: '100%', height: '100%' } };

    if (isPaperHeatmap) {
      return (
        <Heatmap
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          image={paperImage}
          colors={heatmapColors}
          colorBack={bgHex}
          contour={hmContour}
          angle={hmAngle}
          noise={hmNoise}
          innerGlow={hmInnerGlow}
          outerGlow={hmOuterGlow}
        />
      );
    }

    return (
      <LiquidMetal
        {...sizing}
        {...common}
        webGlContextAttributes={webGlContextAttributes}
        image={paperImage}
        shape="none"
        colorBack={bgHex}
        colorTint="#ffffff"
        repetition={lmRepetition}
        softness={lmSoftness}
        shiftRed={lmShiftRed}
        shiftBlue={lmShiftBlue}
        distortion={lmDistortion}
        contour={lmContour}
        angle={lmAngle}
      />
    );
  };

  return (
    <motion.section
      className="shader-tool"
      data-header-theme="light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        background: pageBg,
        color: pageFg,
        minHeight: '100vh',
        borderBottom: '1px solid #000000',
      }}
    >
      <div style={{ padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-xxl)', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Material Lab</h1>
          <div className="small-text" style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Image shader editor
          </div>
        </div>

        <div style={{ height: 1, background: '#000000', margin: 'var(--spacing-md) 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: layoutColumns, gap: 'var(--spacing-md)', alignItems: 'start' }}>
          <div style={{ border: '1px solid rgba(17,17,17,0.18)', borderRadius: 14, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', padding: 14, maxHeight: sidePanelMaxHeight, overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginBottom: 10 }}>INPUT</div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label className="small-text" style={{ display: 'grid', gap: 8, minWidth: 0 }}>
                <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Upload PNG or SVG</span>
                <input
                  type="file"
                  accept="image/png,image/svg+xml"
                  style={{ width: '100%', minWidth: 0 }}
                  onChange={async (ev) => {
                    const file = ev.target.files && ev.target.files[0];
                    if (!file) return;
                    try {
                      await loadImageFromFile(file);
                      scheduleRender();
                    } catch (e) {
                      setStatusMessage(e instanceof Error ? e.message : 'Failed to load image');
                      scheduleRender();
                    }
                  }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Frame</span>
                  <select style={fieldBaseStyle} value={framePresetId} onChange={(ev) => setFramePresetId(ev.target.value)}>
                    {FRAME_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Custom</span>
                  <select style={fieldBaseStyle} value={useCustomFrame ? 'custom' : 'preset'} onChange={(ev) => setUseCustomFrame(ev.target.value === 'custom')}>
                    <option value="preset">Preset</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
              </div>

              {useCustomFrame && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Width</span>
                    <input style={fieldBaseStyle} type="number" value={customW} min={64} max={4096} onChange={(ev) => setCustomW(Number(ev.target.value))} />
                  </label>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Height</span>
                    <input style={fieldBaseStyle} type="number" value={customH} min={64} max={4096} onChange={(ev) => setCustomH(Number(ev.target.value))} />
                  </label>
                </div>
              )}

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 12 }}>LAYOUT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Fit</span>
                  <select style={fieldBaseStyle} value={fitMode} onChange={(ev) => setFitMode(ev.target.value)}>
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Zoom</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 92px', gap: 10, alignItems: 'center' }}>
                    <input
                      style={rangeStyle}
                      type="range"
                      min={20}
                      max={200}
                      step={1}
                      value={Math.round((isPaperShader ? paperScale : zoom) * 100)}
                      onChange={(ev) => {
                        const pct = clamp(Number(ev.target.value), 20, 200);
                        const v = pct / 100;
                        if (isPaperShader) setPaperScale(v);
                        else setZoom(v);
                      }}
                    />
                    <input
                      style={fieldBaseStyle}
                      type="number"
                      min={20}
                      max={200}
                      step={1}
                      value={Math.round((isPaperShader ? paperScale : zoom) * 100)}
                      onChange={(ev) => {
                        const raw = Number(ev.target.value);
                        if (!Number.isFinite(raw)) return;
                        const pct = clamp(raw, 20, 200);
                        const v = pct / 100;
                        if (isPaperShader) setPaperScale(v);
                        else setZoom(v);
                      }}
                    />
                  </div>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Pan X</span>
                  <input
                    style={rangeStyle}
                    type="range"
                    min={-1}
                    max={1}
                    step={0.001}
                    value={isPaperShader ? paperOffsetX : panX}
                    onChange={(ev) => {
                      const v = Number(ev.target.value);
                      if (isPaperShader) setPaperOffsetX(v);
                      else setPanX(v);
                    }}
                  />
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Pan Y</span>
                  <input
                    style={rangeStyle}
                    type="range"
                    min={-1}
                    max={1}
                    step={0.001}
                    value={isPaperShader ? paperOffsetY : panY}
                    onChange={(ev) => {
                      const v = Number(ev.target.value);
                      if (isPaperShader) setPaperOffsetY(v);
                      else setPanY(v);
                    }}
                  />
                </label>
              </div>

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 12 }}>EFFECT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shader</span>
                  <select style={fieldBaseStyle} value={effect} onChange={(ev) => setEffect(ev.target.value)}>
                    <option value="liquid-metal">Liquid Metal</option>
                    <option value="heatmap">Heatmap</option>
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Animate</span>
                  <select style={fieldBaseStyle} value={animate ? 'on' : 'off'} onChange={(ev) => setAnimate(ev.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </label>
              </div>

              {isPaperShader && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Speed</span>
                    <input style={rangeStyle} type="range" min={0} max={2} step={0.01} value={paperSpeed} onChange={(ev) => setPaperSpeed(Number(ev.target.value))} />
                  </label>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Rotation</span>
                    <input style={rangeStyle} type="range" min={0} max={360} step={1} value={paperRotation} onChange={(ev) => setPaperRotation(Number(ev.target.value))} />
                  </label>
                </div>
              )}

              {isPaperLiquidMetal && (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Distortion</span>
                    <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={lmDistortion} onChange={(ev) => setLmDistortion(Number(ev.target.value))} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Repetition</span>
                      <input style={rangeStyle} type="range" min={1} max={10} step={0.1} value={lmRepetition} onChange={(ev) => setLmRepetition(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Softness</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={lmSoftness} onChange={(ev) => setLmSoftness(Number(ev.target.value))} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shift Red</span>
                      <input style={rangeStyle} type="range" min={-1} max={1} step={0.01} value={lmShiftRed} onChange={(ev) => setLmShiftRed(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shift Blue</span>
                      <input style={rangeStyle} type="range" min={-1} max={1} step={0.01} value={lmShiftBlue} onChange={(ev) => setLmShiftBlue(Number(ev.target.value))} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Contour</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={lmContour} onChange={(ev) => setLmContour(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Angle</span>
                      <input style={rangeStyle} type="range" min={0} max={360} step={1} value={lmAngle} onChange={(ev) => setLmAngle(Number(ev.target.value))} />
                    </label>
                  </div>
                </>
              )}

              {isPaperHeatmap && (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Contour</span>
                    <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={hmContour} onChange={(ev) => setHmContour(Number(ev.target.value))} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Inner glow</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={hmInnerGlow} onChange={(ev) => setHmInnerGlow(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Outer glow</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={hmOuterGlow} onChange={(ev) => setHmOuterGlow(Number(ev.target.value))} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Noise</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={hmNoise} onChange={(ev) => setHmNoise(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Angle</span>
                      <input style={rangeStyle} type="range" min={0} max={360} step={1} value={hmAngle} onChange={(ev) => setHmAngle(Number(ev.target.value))} />
                    </label>
                  </div>

                  <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 6 }}>
                    Colors
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {hmColors.map((value, index) => (
                      <label key={index} className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{`Color ${index + 1}`}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
                          <input
                            style={{ width: 44, height: 40, padding: 0, border: '1px solid rgba(17, 17, 17, 0.18)', borderRadius: 10, background: '#FFFFFF' }}
                            type="color"
                            value={value}
                            onChange={(ev) => {
                              const next = ev.target.value;
                              setHmColors((prev) => prev.map((c, i) => (i === index ? next : c)));
                            }}
                          />
                          <input
                            style={fieldBaseStyle}
                            value={value}
                            onChange={(ev) => {
                              const next = ev.target.value;
                              setHmColors((prev) => prev.map((c, i) => (i === index ? next : c)));
                            }}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {isLegacyShader && (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Intensity</span>
                    <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={intensity} onChange={(ev) => setIntensity(Number(ev.target.value))} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Paper grain</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={grain} onChange={(ev) => setGrain(Number(ev.target.value))} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Metal shine</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={shine} onChange={(ev) => setShine(Number(ev.target.value))} />
                    </label>
                  </div>

                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Hue shift</span>
                    <input style={rangeStyle} type="range" min={-1} max={1} step={0.005} value={hue} onChange={(ev) => setHue(Number(ev.target.value))} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Tint</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
                        <input style={{ width: 44, height: 40, padding: 0, border: '1px solid rgba(17, 17, 17, 0.18)', borderRadius: 10, background: '#FFFFFF' }} type="color" value={tintHex} onChange={(ev) => setTintHex(ev.target.value)} />
                        <input style={fieldBaseStyle} value={tintHex} onChange={(ev) => setTintHex(ev.target.value)} />
                      </div>
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Background</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
                        <input style={{ width: 44, height: 40, padding: 0, border: '1px solid rgba(17, 17, 17, 0.18)', borderRadius: 10, background: '#FFFFFF' }} type="color" value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                        <input style={fieldBaseStyle} value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                      </div>
                    </label>
                  </div>
                </>
              )}

              {isPaperShader && (
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Background</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
                    <input style={{ width: 44, height: 40, padding: 0, border: '1px solid rgba(17, 17, 17, 0.18)', borderRadius: 10, background: '#FFFFFF' }} type="color" value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                    <input style={fieldBaseStyle} value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                  </div>
                </label>
              )}

              <button
                type="button"
                className="mobile-nav-link"
                style={{ minHeight: 54 }}
                onClick={downloadPng}
              >
                Download PNG
              </button>

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 10 }}>VIDEO EXPORT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Duration</span>
                  <select style={fieldBaseStyle} value={String(videoDuration)} onChange={(ev) => setVideoDuration(Number(ev.target.value))} disabled={isRecording}>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="20">20 seconds</option>
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>FPS</span>
                  <select style={fieldBaseStyle} value={String(videoFps)} onChange={(ev) => setVideoFps(Number(ev.target.value))} disabled={isRecording}>
                    <option value="24">24</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                </label>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  className="mobile-nav-link"
                  style={{ minHeight: 54 }}
                  onClick={startRecording}
                  disabled={isFinalizing}
                >
                  Download Video (MP4)
                </button>
              ) : (
                <button
                  type="button"
                  className="mobile-nav-link"
                  style={{ minHeight: 54 }}
                  onClick={stopRecording}
                  disabled={isFinalizing}
                >
                  {isFinalizing ? 'Finalizing…' : 'Stop Recording'}
                </button>
              )}

              {mp4Download && !isRecording && (
                <div style={{ display: 'grid', gap: 10 }}>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    style={{ minHeight: 54 }}
                    onClick={saveMp4}
                  >
                    {isMobileDevice ? 'Save to Photos' : 'Save MP4'}
                  </button>
                  <div style={{ border: '1px solid rgba(17,17,17,0.18)', borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
                    <video
                      src={mp4Download.url}
                      controls
                      playsInline
                      muted
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    style={{ minHeight: 44, background: 'transparent' }}
                    onClick={clearMp4Download}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(17,17,17,0.18)', borderRadius: 14, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>PREVIEW</div>
              <div className="small-text" style={{ opacity: 0.85 }}>
                {`${frameW}×${frameH}`} • {fitMode} • {effect}
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(17,17,17,0.12)', margin: '12px 0' }} />

            <div style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
              <div style={{ width: 'min(920px, 100%)' }}>
                <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden', background: bgHex }}>
                  <div style={{ width: '100%', aspectRatio: `${frameW} / ${frameH}` }}>
                    {isPaperShader ? (
                      <div ref={paperPreviewMountRef} style={{ width: '100%', height: '100%' }}>
                        {renderPaperShader('preview')}
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="small-text" style={{ marginTop: 10, opacity: 0.75, lineHeight: 1.2 }}>
                  {statusMessage || ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPaperShader && paperExportActive && (
          <div
            ref={paperExportMountRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: -10000,
              top: 0,
              width: frameW,
              height: frameH,
              opacity: 0,
              pointerEvents: 'none',
            }}
          >
            {renderPaperShader('export')}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default Tools;
