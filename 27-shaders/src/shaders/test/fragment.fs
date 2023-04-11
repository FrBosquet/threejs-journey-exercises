precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation + 0.3;

  gl_FragColor = vec4(vElevation * 2.0, 0.0, 0.5, 1.0);
}