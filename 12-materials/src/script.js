import * as lil from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

const gui = new lil.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => console.log('start')
loadingManager.onProgress = () => console.log('progress')
loadingManager.onError = e => console.log('error', e)
loadingManager.onLoad = () => console.log('load')

const textureLoader = new THREE.TextureLoader(loadingManager)
const textures = {
  door: {
    alpha: textureLoader.load('/textures/door/alpha.jpg'),
    ambientOcclusion: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
    color: textureLoader.load('/textures/door/color.jpg'),
    height: textureLoader.load('/textures/door/height.jpg'),
    metalness: textureLoader.load('/textures/door/metalness.jpg'),
    normal: textureLoader.load('/textures/door/normal.jpg'),
    roughness: textureLoader.load('/textures/door/roughness.jpg'),
  },
  environmentMaps: {
    0: {
      nx: textureLoader.load('/textures/environmentMaps/0/nx.jpg'),
      ny: textureLoader.load('/textures/environmentMaps/0/ny.jpg'),
      nz: textureLoader.load('/textures/environmentMaps/0/nz.jpg'),
      px: textureLoader.load('/textures/environmentMaps/0/px.jpg'),
      py: textureLoader.load('/textures/environmentMaps/0/py.jpg'),
      pz: textureLoader.load('/textures/environmentMaps/0/pz.jpg'),
    },
    1: {
      nx: textureLoader.load('/textures/environmentMaps/1/nx.jpg'),
      ny: textureLoader.load('/textures/environmentMaps/1/ny.jpg'),
      nz: textureLoader.load('/textures/environmentMaps/1/nz.jpg'),
      px: textureLoader.load('/textures/environmentMaps/1/px.jpg'),
      py: textureLoader.load('/textures/environmentMaps/1/py.jpg'),
      pz: textureLoader.load('/textures/environmentMaps/1/pz.jpg'),
    },
    2: {
      nx: textureLoader.load('/textures/environmentMaps/2/nx.jpg'),
      ny: textureLoader.load('/textures/environmentMaps/2/ny.jpg'),
      nz: textureLoader.load('/textures/environmentMaps/2/nz.jpg'),
      px: textureLoader.load('/textures/environmentMaps/2/px.jpg'),
      py: textureLoader.load('/textures/environmentMaps/2/py.jpg'),
      pz: textureLoader.load('/textures/environmentMaps/2/pz.jpg'),
    },
    3: {
      nx: textureLoader.load('/textures/environmentMaps/3/nx.jpg'),
      ny: textureLoader.load('/textures/environmentMaps/3/ny.jpg'),
      nz: textureLoader.load('/textures/environmentMaps/3/nz.jpg'),
      px: textureLoader.load('/textures/environmentMaps/3/px.jpg'),
      py: textureLoader.load('/textures/environmentMaps/3/py.jpg'),
      pz: textureLoader.load('/textures/environmentMaps/3/pz.jpg'),
    },
  },
  gradients: {
    3: textureLoader.load('/textures/gradients/3.jpg'),
    5: textureLoader.load('/textures/gradients/5.jpg'),
  },
  matcaps: {
    1: textureLoader.load('/textures/matcaps/1.png'),
    2: textureLoader.load('/textures/matcaps/2.png'),
    3: textureLoader.load('/textures/matcaps/3.png'),
    4: textureLoader.load('/textures/matcaps/4.png'),
    5: textureLoader.load('/textures/matcaps/5.png'),
    6: textureLoader.load('/textures/matcaps/6.png'),
    7: textureLoader.load('/textures/matcaps/7.png'),
    8: textureLoader.load('/textures/matcaps/8.png'),
  },
}

/**
 *  Objects
 */

const material = new THREE.MeshStandardMaterial()
// const material = new THREE.MeshToonMaterial()
// const material = new THREE.MeshPhongMaterial()
// const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshDepthMaterial()
// const material = new THREE.MeshMatcapMaterial()
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshBasicMaterial({})

// material.map = textures.door.color
// material.color.set(0x00ff00)
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = textures.door.alpha
// material.side = THREE.DoubleSide
// material.shininess = 100
// material.specular = new THREE.Color('red')
// material.matcap = textures.matcaps['5']
// material.gradientMap = textures.gradients['5']
// textures.gradients['5'].generateMipmaps = false
// textures.gradients['5'].minFilter = THREE.NearestFilter
// textures.gradients['5'].magFilter = THREE.NearestFilter

gui.add(material, 'metalness', 0, 1)
gui.add(material, 'roughness', 0, 1)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 16),
  material
)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(sphere, plane, torus, ambientLight, pointLight)

sphere.position.x = -1.5
torus.position.x = 1.5

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * clock.elapsedTime
  plane.rotation.y = 0.1 * clock.elapsedTime
  torus.rotation.y = 0.1 * clock.elapsedTime

  sphere.rotation.x = 0.15 * clock.elapsedTime
  plane.rotation.x = 0.15 * clock.elapsedTime
  torus.rotation.x = 0.15 * clock.elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
