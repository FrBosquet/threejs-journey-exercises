import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const tester = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#aaaaff' })
)
object3.position.x = 2

scene.add(object1, object2, object3, tester)

const raycaster = new THREE.Raycaster()

/**
 * Line
 */

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaff })
const points = []
const point1 = new THREE.Vector3(-5, 0, 0)
const point2 = new THREE.Vector3(5, 0, 0)
points.push(point1, point2)
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

const line = new THREE.Line(lineGeometry, lineMaterial)
scene.add(line)

/*
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

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

const mouseCaster = new THREE.Raycaster()

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Model Loader
 */
const objects = [object1, object2, object3]
let duck
const gltfLoader = new GLTFLoader()
gltfLoader.load('models/Duck/glTF-Binary/Duck.glb', (gltf) => {
    duck = gltf.scene.children[0].children[0]
    scene.add(duck)

    duck.scale.set(0.01, 0.01, 0.01)
    duck.position.set(4, -1, 0)
    duck.rotateY(-Math.PI / 3)

    objects.push(duck)
})

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1)
directionalLight.position.set(1, 2, 3)
directionalLight.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    object1.position.y = Math.sin(elapsedTime + Math.PI / 2)
    object2.position.y = Math.sin(elapsedTime)
    object3.position.y = Math.sin(elapsedTime - Math.PI / 2)

    raycaster.set(new THREE.Vector3(-5, 0, 0), new THREE.Vector3(1, 0, 0))

    const intersect = raycaster.intersectObjects(objects)

    for (const object of objects) {
        if (object === duck) {
            object.material.color.set('#fff')
        } else {
            object.material.color.set('#ff0000')
        }
    }

    if (intersect.length) {
        if (intersect[0].object === duck) {
            intersect[0].object.material.color.set('#AA00FF')
        } else {
            intersect[0].object.material.color.set('#0000aa')
        }
        point2.copy(intersect[0].point)
        tester.position.copy(intersect[0].point)
    } else {
        point2.set(5, 0, 0)
        tester.position.set(-5, 0, 0)
    }

    // Update line geometry
    lineGeometry.setFromPoints([point1, point2])

    // Update mouse raycaster
    mouseCaster.setFromCamera(mouse, camera)
    const mouseIntersects = mouseCaster.intersectObjects(objects)

    if (mouseIntersects.length) {
        mouseIntersects[0].object.material.color.set('#00ff00')
        document.body.style.cursor = 'pointer'
    } else {
        document.body.style.cursor = 'default'
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()