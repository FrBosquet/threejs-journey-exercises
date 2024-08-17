import * as dat from 'lil-gui'
import * as THREE from 'three'
import { CineonToneMapping, CubeTextureLoader, DirectionalLight, Mesh, MeshStandardMaterial, PCFSoftShadowMap, sRGBEncoding } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new CubeTextureLoader()


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const guiDebug = {
    envIntensity: 1.2
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const enviromentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

enviromentMap.encoding = sRGBEncoding

scene.background = enviromentMap
scene.environment = enviromentMap

const directionalLight = new DirectionalLight(0xffffff, 3)
directionalLight.position.set(-1, 3, 2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(2048, 2048)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

const updateMaterials = () => {
    scene.traverse(child => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
            // child.material.envMap = enviromentMap
            child.material.envMapIntensity = guiDebug.envIntensity
            child.material.needsUpdate = true

            child.castShadow = true
            child.receiveShadow = true

        }
    })
}

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('light intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).name('light x')
gui.add(directionalLight.position, 'y').min(-5).max(5).name('light y')
gui.add(directionalLight.position, 'z').min(-5).max(5).name('light z')
gui.add(guiDebug, 'envIntensity').min(0).max(10).step(0.01).name('environment intensity').onChange(updateMaterials)

gltfLoader.load('/models/hamburger.glb',
    gltf => {
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        gltf.scene.position.set(0, -2, 0)
        gltf.scene.rotation.y = Math.PI * 0.5

        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotation')

        scene.add(gltf.scene)

        updateMaterials()
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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = sRGBEncoding
renderer.toneMappingExposure = 6
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap
renderer.toneMapping = CineonToneMapping
renderer.toneMappingExposure = 2.75

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01).name('tonaMapIntensity')

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()