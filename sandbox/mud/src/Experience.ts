import { AmbientLight, BackSide, BoxGeometry, BufferAttribute, BufferGeometry, Camera, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SpotLight, WebGLRenderer } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ModelLoader } from './ModelLoader';
import { carShaderMaterial } from './Shaders/CarShader';

export class Experience {
  canvas: HTMLCanvasElement
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  scene: Scene
  camera: Camera
  cameraControls: OrbitControls
  renderer: WebGLRenderer
  rotationSpeed = 1
  moveSpeed = 0.05

  cube: Mesh
  loader: ModelLoader
  carGeometry?: BufferGeometry

  constructor() {
    this.canvas = document.querySelector('canvas#webgl') as HTMLCanvasElement
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height
    )
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    // @ts-ignore
    this.renderer.useLegacyLights = true;
    this.loader = new ModelLoader();

    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshStandardMaterial({ color: 0xAA9999 })

    material.side = BackSide

    this.cube = new Mesh(
      geometry,
      material
    )


    this.camera.position.z = 3


    const light = new SpotLight(0xffffff, 50)
    const ambient = new AmbientLight(0x999999)

    light.position.y = 2
    light.position.z = 1
    light.position.x = 2

    this.scene.add(light)
    this.scene.add(ambient)

    this.loader.loadModel('/models/three-car.glb').then((gltf) => {
      gltf.scene.scale.set(0.4, 0.4, 0.4);
      // cast child to Mesh
      (gltf.scene.children as Mesh[]).forEach((child) => {
        child.material = carShaderMaterial;

        // @ts-ignore
        const [maxZ, minZ] = Experience.getZBoundaries(child.geometry);

        const redness = new Float32Array(child.geometry.attributes.position.count)
          const position = child.geometry.attributes.position as BufferAttribute;

        redness.forEach((_, i) => {
          const z = position.array[(i * 3) + 2];

          const value = (z - minZ) / (maxZ - minZ);

          redness[i] = value;
        })

        child.geometry.setAttribute('redness', new BufferAttribute(redness, 1))
      });

      this.carGeometry = (gltf.scene.children[0] as any).geometry as BufferGeometry
      
      this.scene.add(gltf.scene);
    })

    this.render()
  }

  static getZBoundaries(geometry: BufferGeometry): [number, number] {
    const count = geometry.attributes.position.count;
    const position = geometry.attributes.position as BufferAttribute;
    let maxZ = 0;
    let minZ = 0;

    for (let i = 0; i < count; i++) {
      const z = position.array[(i * 3) + 2];

      if (maxZ < z) {
        maxZ = z
      } else if (minZ > z) {
        minZ = z
      }
    }
    
    return [maxZ, minZ];
  }

  render() {
    this.cameraControls.update();
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(() => this.render())
  }
}