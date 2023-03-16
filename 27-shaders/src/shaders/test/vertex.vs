uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime;
uniform float uAmplitude;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * uAmplitude;
  modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * uAmplitude;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;

  gl_Position = projectedPosition;
}