import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

//BASIC

//1. created scene 
const scene = new THREE.Scene()

//2. defined geometrys and materials

const x = 0, y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const heart = new THREE.ShapeGeometry(heartShape);
const heartMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(heart, heartMaterial);
mesh.scale.set(.3, .3, .3)

// values -> 1: ratio, 2: widthSegments, 3: heigthSegments -- more smooth
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#fff',
  roughness: 0.5
})

//mesh the geometry and material 
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// sizes

const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// light 
const light = new THREE.PointLight(0xffffff, 10, 100)
light.position.set(0, 10, 10)
light.intensity = 20

scene.add(light)

//3. camera 
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100)
camera.position.z = 20
camera.lookAt(0, 0, 0);
scene.add(camera)


//4. Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })

renderer.setSize(size.width, size.height)
renderer.render(scene, camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, 0, 0); // Establece el punto de enfoque en el centro de la escena
controls.autoRotate = true
controls.rotateSpeed = 5
controls.enablePan = false
controls.enableZoom = false

//resize
window.addEventListener("resize", () => {

  //update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight

  //update camera and render  
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
})

//timeline 
const tl = gsap.timeline({
  defaults: {
    duration: .8
  }
})

tl.fromTo(
  sphere.scale,
  { z: 0, x: 0, y: 0 },
  { z: 1, x: 1, y: 1 },
)

tl.fromTo(
  'nav',
  { y: '-100%' },
  { y: '0%' }
)

tl.fromTo(
  '.title',
  { opacity: 0 },
  { opacity: 1 }
)


//animation color
let mouseDown = false
let rgb = []

window.addEventListener('mousedown', () => {
  mouseDown = true
})

window.addEventListener('mouseup', () => {
  mouseDown = false
})

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      150,
    ]
    
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(sphere.material.color, 
      {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b
      }
    )
  }
})

const animation = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}

animation()