import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './style.css'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Cursor
 */

// const cursor = {}
// window.addEventListener('mousemove', ({ clientX, clientY }) => {
//   if (!cursor.x) {
//     cursor.dx = 0
//     cursor.x = clientX
//   } else {
//     cursor.dx = clientX - cursor.x
//     cursor.x = clientX
//   }

//   if (!cursor.y) {
//     cursor.dy = 0
//     cursor.y = clientY
//   } else {
//     cursor.dy = clientY - cursor.y
//     cursor.y = clientY
//   }
//   cursor.ax = 2 * (cursor.x / window.innerWidth - 0.5)
//   cursor.ay = 2 * (cursor.y / window.innerHeight - 0.5)
// })

// Sizes
const sizes = {
  width: 600,
  height: 400,
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100
)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)

console.log(camera.position.length())
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  //   mesh.rotation.y = elapsedTime

  //   const scale = 3
  //   const hscale = scale * Math.cos(0.5 * cursor.ay * Math.PI)

  //   camera.position.y = scale * Math.sin(0.5 * cursor.ay * Math.PI)
  //   camera.position.x = hscale * Math.cos(cursor.ax * Math.PI)
  //   camera.position.z = hscale * Math.sin(cursor.ax * Math.PI)
  //   camera.lookAt(mesh.position)
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
