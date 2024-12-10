import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.environmentIntensity = 2
scene.backgroundIntensity = 1.75
scene.backgroundBlurriness = 0.05

gui.add(scene, 'environmentIntensity', 0, 10, 0.01)
gui.add(scene, 'backgroundIntensity', 0, 10, 0.01)
gui.add(scene, 'backgroundBlurriness', 0, 1, 0.01)
gui.add(scene.backgroundRotation, 'y')
    .min(0)
    .max(Math.PI * 2)
    .step(0.01)
    .name('backgroundRotation')
    .onChange((value) => {
        scene.environmentRotation.y = value
    })

// HDR Map
// rgbeLoader.load('/environmentMaps/myEnv/blender2k.hdr', (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.environment = envMap
//     // scene.background = envMap
// })

// EXR Loader (Nvidia Canvas)
// const exrLoader = new EXRLoader()
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping
//     scene.background = texture
//     scene.environment = texture
// })

// Ground projected texture
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.environment = envMap

//     const skybox = new GroundedSkybox(
//         envMap,
//         15, 70
//     )

//     skybox.position.y = 15

//     scene.add(skybox)
// })

// Realtime Environment Map
const textureLoader = new THREE.TextureLoader()
const envMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')

envMap.colorSpace = THREE.SRGBColorSpace
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = envMap

const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.layers.enable(1)
holyDonut.position.y = 4
scene.add(holyDonut)

// const envMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ])
// scene.background = envMap
// scene.environment = envMap


/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0,
        color: 0xaaaaaa,
    })
)
torusKnot.position.y = 4
torusKnot.position.x = 5
scene.add(torusKnot)

// Cube rendered target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, { type: THREE.FloatType })

scene.environment = cubeRenderTarget.texture
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

/**
 * Load Model
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        // gltf.scene.position.x = -3
        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Real time environment map
    if (holyDonut) {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2

        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()