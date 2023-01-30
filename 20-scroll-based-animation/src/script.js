import gsap from 'gsap'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { BufferAttribute, BufferGeometry, DirectionalLight, Group, MeshToonMaterial, NearestFilter, Points, PointsMaterial, TextureLoader } from 'three'

const OBJECT_DIST = 10


/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particles.material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = NearestFilter

/* 
    Particles
*/
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 5
    positions[i * 3 + 1] = - OBJECT_DIST * 0.4 + Math.random() * OBJECT_DIST * 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5
}

const particlesGeometry = new BufferGeometry()
particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))

const particlesMaterial = new PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/* 
    Objects
*/
const material = new MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const meshes = [
    new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        material
    ),
    new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        material
    ),
    new THREE.Mesh(
        new THREE.TorusKnotGeometry(.8, .35, 100, 16),
        material
    ),
]


scene.add(...meshes)

meshes.forEach((m, i) => {
    m.position.y = OBJECT_DIST * i
    m.position.x = 1.5 * (i % 2 ? - 1 : 1)
    m.scale.set(1, 1, 1)
})

/* 
    Light
*/
const light = new DirectionalLight({ color: 0xffffff })
light.position.set(1, 1, 0)

scene.add(light)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let currentSection = 0

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

    scroll = window.scrollY / window.innerHeight
})

const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width
    cursor.y = event.clientY / sizes.height
})

/**
 * Camera
 */
// Base camera
const cameraGroup = new Group()
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* 
    Scroll
*/
let scroll = window.scrollY / window.innerHeight
window.addEventListener('scroll', () => {
    scroll = window.scrollY / window.innerHeight

    const newSection = Math.floor(scroll)

    if (newSection != currentSection) {
        gsap.to(meshes[newSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3'
        })


        currentSection = newSection
    }
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0

const tick = () => {
    // Animate camera
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevTime
    prevTime = elapsedTime

    camera.position.y = scroll * OBJECT_DIST

    const parallaxX = (cursor.x - 0.5) * 1
    const parallaxY = - (cursor.y - 0.5) * 1
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime

    meshes.forEach(m => {
        m.rotation.x += deltaTime * 0.3
    })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()