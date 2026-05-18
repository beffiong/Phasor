/* Animated mesh-gradient hero background.
   Uses @paper-design/shaders (GPU-accelerated WebGL fragment shader) to
   render a Pre-dawn Indigo gradient that breathes/shifts continuously.

   The hero <video> remains in the DOM as a fallback for browsers where
   WebGL fails (Safari with hardware accel off, etc.) — the shader canvas
   will simply layer on top when it succeeds. */

import {
  ShaderMount,
  meshGradientFragmentShader,
  getShaderColorFromString,
} from "https://esm.sh/@paper-design/shaders@0.0.72";

// Pre-dawn indigo: deep indigo -> mid indigo -> lavender -> coral dawn -> pale gold sunrise
const COLORS = ["#0a0d24", "#1a1d3f", "#b8a4d4", "#ff8e6b", "#f5dba8"];

function meshUniforms(opts) {
  const colors = (opts.colors || COLORS).map(getShaderColorFromString);
  return {
    u_colors: colors,
    u_colorsCount: colors.length,
    u_distortion: opts.distortion ?? 1,
    u_swirl: opts.swirl ?? 0.62,
    u_grainMixer: opts.grainMixer ?? 0,
    u_grainOverlay: opts.grainOverlay ?? 0.45,
    u_fit: 1,
    u_scale: opts.scale ?? 1,
    u_rotation: opts.rotation ?? 0,
    u_offsetX: opts.offsetX ?? 0,
    u_offsetY: opts.offsetY ?? 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  };
}

function mountMesh(target, opts = {}) {
  if (!target) return null;
  try {
    return new ShaderMount(
      target,
      meshGradientFragmentShader,
      meshUniforms(opts),
      undefined,
      opts.speed ?? 0.9,
      0,
      2
    );
  } catch (err) {
    console.error("MeshGradient mount failed:", err);
    return null;
  }
}

mountMesh(document.querySelector(".hero-bg-dither"));
