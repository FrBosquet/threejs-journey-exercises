import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)


const sizes = { w: 800, h: 600 }

const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h)
camera.position.z = 3
camera.position.x = 1
scene.add(camera)

const canvas = document.querySelector('#webgl')

const renderer = new THREE.WebGLRenderer({
  canvas,
})

renderer.setSize(sizes.w, sizes.h)
renderer.render(scene, camera)
