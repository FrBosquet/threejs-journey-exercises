import { Color, RawShaderMaterial, TextureLoader, Vector2 } from "three"
import fragmentShader from './shaders/test/fragment.fs'
import vertexShader from './shaders/test/vertex.vs'

const textureLoader = new TextureLoader()
const texture = textureLoader.load('/textures/flag-french.jpg')

export const material = new RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uFrequency: { value: new Vector2(10, 5) },
    uTime: { value: 0 },
    uAmplitude: { value: 0.1 },
    uColor: { value: new Color('orange')},
    uTexture: { value: texture }
  }
})