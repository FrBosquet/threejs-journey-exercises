uniform vec2 uFrequency;
uniform float uTime;
uniform float uAmplitude;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * uAmplitude + sin(modelPosition.y * uFrequency.y + uTime) * uAmplitude;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vElevation = elevation;

  gl_Position = projectedPosition;
}