import { ShaderMaterial } from "three"

export const carShaderMaterial = new ShaderMaterial({
  vertexShader: `
attribute float redness;

varying float vRedness;

void main() {
  vRedness = redness;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0) ;
}
  `,
  fragmentShader: `
precision mediump float;

uniform vec3 uColor;

varying float vRedness;

void main() {
  vec4 color = vec4(0.0, 0.5, 0.5, 1.0);

  color.r = vRedness;

  gl_FragColor = color;
}
  `,
  uniforms: {}
})