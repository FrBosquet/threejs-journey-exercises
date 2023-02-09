import { Body, Box, ContactMaterial, Material, Plane, SAPBroadphase, Sphere, Vec3, World } from 'cannon'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Debug
 */
const debugToolbox = {
    createSphere: () => {
        createSphere(0.5, new Vector3(0.1 * Math.random(), 10, 0.1 * Math.random()))
    },
    createBox: () => {
        createBox(0.5, new Vector3(0.1 * Math.random(), 10, 0.1 * Math.random()))
    }
}
const gui = new dat.GUI()
gui.add(debugToolbox, 'createSphere')
gui.add(debugToolbox, 'createBox')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

const materials = {
    plastic: new Material('plastic'),
    concrete: new Material('concrete'),
}

const contactMaterial = new ContactMaterial(
    materials.concrete,
    materials.plastic,
    {
        friction: 0.1,
        restitution: 0.6,
    }
)

/* 
    Sounds
*/
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const velocity = collision.contact.getImpactVelocityAlongNormal()

    if (velocity > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }

}


/* 
    World
*/

const world = new World()
world.addContactMaterial(contactMaterial)

world.gravity.set(0, -9.8, 0)

const floorShape = new Plane()
const floorBody = new Body({
    mass: 0,
    shape: floorShape,
    material: materials.concrete
})

floorBody.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI * 0.5)

world.addBody(floorBody)
world.broadphase = new SAPBroadphase(world)
world.allowSleep = true

const objectsToUpdate = []

const sphereGeometry = new SphereGeometry(1, 20, 20)
const sphereMaterial = new MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.3,
    envMap: environmentMapTexture
})

const boxGeometry = new BoxGeometry(1, 1, 1, 2, 2, 2)

const createSphere = (rad, pos) => {
    const mesh = new Mesh(
        sphereGeometry,
        sphereMaterial
    )

    mesh.scale.set(rad, rad, rad)
    mesh.castShadow = true
    mesh.position.copy(pos)

    scene.add(mesh)

    const shape = new Sphere(rad)
    const body = new Body({
        mass: 1,
        position: new Vec3(0, 2, 0),
        shape,
        material: materials.plastic
    })
    body.position.copy(pos)

    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

const createBox = (size, pos) => {
    const mesh = new Mesh(
        boxGeometry,
        sphereMaterial
    )

    mesh.scale.set(size, size, size)
    mesh.castShadow = true
    mesh.position.copy(pos)

    scene.add(mesh)

    const halfBody = size / 2
    const shape = new Box(new Vec3(halfBody, halfBody, halfBody))
    const body = new Body({
        mass: 1,
        position: new Vec3(0, 2, 0),
        shape,
        material: materials.plastic
    })
    body.position.copy(pos)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, new Vector3(0, 3, 0))



/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevElepsedtime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevElepsedtime
    prevElepsedtime = elapsedTime

    world.step(
        1 / 60,
        deltaTime,
        3
    )

    objectsToUpdate.forEach(o => {
        o.mesh.position.copy(o.body.position)
        o.mesh.quaternion.copy(o.body.quaternion)


    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()