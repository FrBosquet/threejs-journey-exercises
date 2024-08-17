precision mediump float;

varying vec2 vUv;
varying float vElevation;

uniform sampler2D uTexture;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);

    textureColor.rgb *= (vElevation / 4.0) + 0.6;

    gl_FragColor = vec4(textureColor);
}