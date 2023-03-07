import { AmbientLight, BackSide, BoxGeometry, Camera, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SpotLight, WebGLRenderer } from 'three'
import { Keyboard } from './Keyboard'

export class Experience {
  canvas: HTMLCanvasElement
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  scene: Scene
  camera: Camera
  renderer: WebGLRenderer
  keyboard: Keyboard
  rotationSpeed = 1
  moveSpeed = 0.05

  cube: Mesh

  constructor(){
    this.keyboard = new Keyboard()
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

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.physicallyCorrectLights = true

    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshStandardMaterial({ color: 0xAA9999 })

    material.side = BackSide
    
    this.cube = new Mesh(
      geometry,
      material
    )


    console.log(geometry);

    this.camera.position.z = 3

    this.scene.add(this.cube)

    const light = new SpotLight(0xffffff, 50)
    const ambient = new AmbientLight(0x222222)

    light.position.y = 2
    light.position.z = 1
    light.position.x = 2

    this.scene.add(light)
    this.scene.add(ambient)

    this.render()
  }

  rotateCamera(degrees: number){
    const radians = (degrees / 180) * Math.PI

    this.camera.rotateY(radians)
  }

  moveCameraForward(meters: number) {
    this.camera.translateZ(meters)
  }

  strafeCamera(meters: number) {
    this.camera.translateX(meters)
  }

  focusCamera(){
    this.camera.lookAt(this.cube.position)
  }


  solveInputs() {
    if(this.keyboard.has('KeyA')) this.rotateCamera(this.rotationSpeed)
    if(this.keyboard.has('KeyD')) this.rotateCamera(-this.rotationSpeed)
    if(this.keyboard.has('KeyW')) this.moveCameraForward(-this.moveSpeed)
    if(this.keyboard.has('KeyS')) this.moveCameraForward(this.moveSpeed)
    if(this.keyboard.has('KeyE')) this.strafeCamera(this.moveSpeed)
    if(this.keyboard.has('KeyQ')) this.strafeCamera(-this.moveSpeed)
    if(this.keyboard.has('Space')) this.focusCamera()
  }

  render(){
    this.solveInputs()

    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(() => this.render())
  }
}