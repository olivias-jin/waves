import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// // GridHelper
// const gridHelper = new THREE.GridHelper(10, 10)
// scene.add(gridHelper)
// // 제거하려면
// scene.remove(gridHelper);

// Model
let duck = null 

gltfLoader.load(
    '/model/Duck.glb',
    (gltf) =>
        {
            duck = gltf.scene
            gltf.scene.scale.set(0.4, 0.4, 0.4)
            gltf.scene.position.set(0, 0, 0)
            scene.add(duck)

        }

)

/* Ambient Light */
const ambientLight = new THREE.AmbientLight('ffffff, 0.5')
scene.add(ambientLight)

/* 
Directonal light
 */
const directonalLight = new THREE.DirectionalLight('#ffffff', 6)
directonalLight.position.set(0, 6.5, 2.5)
scene.add(directonalLight)

const lightFolder = gui.addFolder('Light')
lightFolder.add(directonalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
lightFolder.add(directonalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
lightFolder.add(directonalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
lightFolder.add(directonalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ')


// Color
debugObject.depthColor = '#559dc3'
debugObject.surfaceColor = '#d6efff'
debugObject.borderColor = '#000000';


// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },

        // Waves
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2( 4, 1.5)},
        uBigWavesSpeed: { value: 0.75 },

        // Small Waves
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3},
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesInterations: {value: 4},

        // Color
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor )},
        uColorOffset: { value: 0.08},
        uColorMultiplier: { value: 5},

        // Background
        uBackgroundColor: { value: new THREE.Color(debugObject.borderColor) },


    }
})

// Background Color
scene.background = new THREE.Color(debugObject.borderColor)
// const bgColor = new THREE.Color(scene.background)



// Debug
const waveFolder = gui.addFolder('Waves')

waveFolder.add(waterMaterial.uniforms.uBigWavesElevation,'value').min(0).max(1).step(0.001).name('BigWavesElevation')
waveFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.001).name('BigWavesFrequencyX')
waveFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.001).name('BigWavesFrequencyY')
waveFolder.add(waterMaterial.uniforms.uBigWavesSpeed,'value').min(0).max(10).step(0.001).name('BigWavesSpeed')
waveFolder.add(waterMaterial.uniforms.uSmallWavesElevation,'value').min(0).max(1).step(0.001).name('SmallWavesElevation')
waveFolder.add(waterMaterial.uniforms.uSmallWavesFrequency,'value').min(0).max(30).step(0.001).name('SmallWavesFrequency')
waveFolder.add(waterMaterial.uniforms.uSmallWavesSpeed,'value').min(0).max(4).step(0.001).name('SmallWavesSpeed')
waveFolder.add(waterMaterial.uniforms.uSmallWavesInterations,'value').min(0).max(5).step(1).name('SmallWavesInterations')


const colorFolder = gui.addFolder('Color')

colorFolder
    .addColor(debugObject, 'depthColor')
    .name('depthColor')
    .onChange(() =>
    {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    })

colorFolder
    .addColor(debugObject, 'surfaceColor')
    .name('surfaceColor')
    .onChange(() =>
    {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    })


    colorFolder
    .addColor(debugObject, 'borderColor')
    .name('borderColor')
    .onChange(() => {
      // waterMaterial 유니폼 업데이트
      waterMaterial.uniforms.uBackgroundColor.value.set(debugObject.borderColor);
  
      // 씬 배경색도 같이 바꾸고 싶으면
      scene.background.set(debugObject.borderColor);
    });




colorFolder.add(waterMaterial.uniforms.uColorOffset,'value').min(0).max(1).step(0.001).name('ColorOffset')
colorFolder.add(waterMaterial.uniforms.uColorMultiplier,'value').min(0).max(10).step(0.001).name('ColorMultiplier')


waveFolder.close()
colorFolder.close()
lightFolder.close()

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)





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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
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



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update Duck
    if (duck) {
        const freq = waterMaterial.uniforms.uBigWavesFrequency.value
        const speed = waterMaterial.uniforms.uBigWavesSpeed.value
        const elevation = waterMaterial.uniforms.uBigWavesElevation.value
    
        const duckX = duck.position.x
        const duckZ = duck.position.z
    
        const wave = Math.sin(duckX * freq.x + elapsedTime * speed) *
                     Math.sin(duckZ * freq.y + elapsedTime * speed) *
                     elevation
    
        const offset = -0.3
        duck.position.y = wave + offset
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()