precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

uniform vec2 uFrequency;
uniform float uTime;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = cos((modelPosition.x + uTime) * uFrequency.x) + sin(modelPosition.y * uFrequency.y);

    modelPosition.z += elevation * 0.05;

    vElevation = elevation;
    vUv = uv;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}  