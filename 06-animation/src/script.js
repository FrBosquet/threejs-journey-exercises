import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.reorder('YXZ')
scene.add(mesh)

// Sizes
const sizes = {
  width: 600,
  height: 400,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Animation
// const clock = new THREE.Clock()

gsap.to(mesh.position, { x: 2, duration: 2, delay: 1 })

const tick = () => {
  //   const elapsedTime = clock.getElapsedTime()

  //   camera.position.y = Math.sin(elapsedTime)
  //   camera.position.x = Math.cos(elapsedTime)
  //   camera.lookAt(mesh.position)

  //   mesh.rotation.y = Math.PI * 0.2 * elapsedTime

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
