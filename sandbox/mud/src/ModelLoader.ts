import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
  gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadModel(path: string): Promise<GLTF> {
    return new Promise((resolve) => {
      this.gltfLoader.load(path, (gltf) => {
        resolve(gltf);
      });
    });
  }
}