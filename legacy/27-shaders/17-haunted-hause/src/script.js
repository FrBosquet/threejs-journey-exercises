import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAOTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
)
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
)

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    aoMap: bricksAOTexture,
    roughnessMap: bricksRoughnessTexture,
  })
)

walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

walls.position.y = 2.5 / 2

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    color: 0xb35f45,
  })
)

roof.position.y = 2.5 + 1 / 2
roof.rotation.y = Math.PI / 4

// Door

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAOTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAOTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.05,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
)

door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.y = 0.9
door.position.z = 2 + 0.01

house.add(walls)
house.add(roof)
house.add(door)

// Floor

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAOTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
)
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
)

const setTextureRepeat = (texture, times) => {
  texture.repeat.set(times, times)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
}

setTextureRepeat(grassColorTexture, 8)
setTextureRepeat(grassAOTexture, 8)
setTextureRepeat(grassNormalTexture, 8)
setTextureRepeat(grassRoughnessTexture, 8)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAOTexture,
    roughnessMap: grassRoughnessTexture,
  })
)
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Bush
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bushes = new THREE.Group()

const addBush = (position, scale) => {
  const newBush = new THREE.Mesh(bushGeometry, bushMaterial)
  newBush.scale.set(scale, scale, scale)
  newBush.position.set(position.x, position.y, position.z)
  newBush.castShadow = true

  bushes.add(newBush)
}

addBush(new THREE.Vector3(0.8, 0.2, 2.2), 0.5)
addBush(new THREE.Vector3(1.4, 0.1, 2.1), 0.25)
addBush(new THREE.Vector3(-0.8, 0.1, 2.1), 0.4)
addBush(new THREE.Vector3(-1, 0.05, 2.6), 0.15)

scene.add(bushes)

// Graves
const graves = new THREE.Group()

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

const min = 4
const maxOffset = 4

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = min + Math.random() * maxOffset

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.35, z)
  grave.rotateY(Math.random() * Math.PI * 0.15)
  grave.rotateZ((Math.random() - 0.5) * Math.PI * 0.05)

  grave.castShadow = true
  graves.add(grave)
}

scene.add(graves)

const bgColor = 0x262837

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door ligth
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Ghosts
 **/

const ghosts = new THREE.Group()
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
const ghost3 = new THREE.PointLight(0xffff00, 2, 3)
ghosts.add(ghost1, ghost2, ghost3)
scene.add(ghosts)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * Fog
 */

renderer.setClearColor(bgColor)
const fog = new THREE.Fog(bgColor, 2, 8)
scene.fog = fog

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Ghosts
  const ghost1Angle = elapsedTime * 0.2
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime) + 1

  const ghost2Angle = elapsedTime * -0.4
  ghost2.position.x = Math.cos(ghost2Angle) * 4
  ghost2.position.z = Math.sin(ghost2Angle) * 4
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 3)

  const ghost3Angle = -elapsedTime * 0.8
  ghost3.position.x = Math.cos(ghost3Angle) * (3 + Math.sin(ghost2Angle) * 2)
  ghost3.position.z = Math.sin(ghost3Angle) * (3 + Math.sin(ghost2Angle) * 2)
  ghost3.position.y = Math.sin(elapsedTime * 2) + 1

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
