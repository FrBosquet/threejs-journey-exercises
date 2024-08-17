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
object3.position.x = 2

scene.add(object1, object2, object3)

/* 
    Raycaster
*/

const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(1, 0, 0).normalize()
// raycaster.set(rayOrigin, rayDirection)

// const instersect = raycaster.intersectObject(object2)
// console.log(instersect);

// const instersects = raycaster.intersectObjects([object1, object2, object3]);

// console.log(instersects);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/* Mouse */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
    mouse.x = 2 * e.clientX / sizes.width - 1
    mouse.y = - 2 * e.clientY / sizes.height + 1
})

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
 * Animate
 */
const clock = new THREE.Clock()

let witness = null

const resetWitness = () => {
            if(witness) witness.material.color.set('#ff0000')

}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 2)
    object2.position.y = Math.sin(Math.PI / 2 + elapsedTime * 2) 
    object3.position.y = Math.sin(3 * Math.PI / 4 + elapsedTime * 2)

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0).normalize()

    // raycaster.set(rayOrigin, rayDirection)
    raycaster.setFromCamera(mouse, camera)

    const objects = [object1, object2, object3]

    const intersections = raycaster.intersectObjects(objects)

    // objects.forEach(obj => {
    //     const intersected = intersections.find(i => i.object === obj)

    //     obj.material.color.set(`#ff00${intersected ? '88' : '00'}`)
    // })


    if(intersections.length){
        const target = intersections[0].object

        if(target && target !== witness) {
            resetWitness()
            target.material.color.set('#ff0099')

            witness = target
        }
    }else{
        resetWitness()

        witness = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()