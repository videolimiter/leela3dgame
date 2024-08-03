import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const init = () => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	const scene = new THREE.Scene()
	const canvas = document.querySelector('.canvas')
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
	scene.add(camera)

	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	const renderer = new THREE.WebGLRenderer({canvas})
	renderer.setSize(sizes.width, sizes.height)
	renderer.render(scene, camera)
	camera.position.set(0, 16, 12)

	const hemiLight = new THREE.HemisphereLight(0xdfffff, 0xdfffff, 0.5)
	hemiLight.position.set(0, 150, 0)
	hemiLight.castShadow = true
	hemiLight.receiveShadow = true
	scene.add(hemiLight)

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
	directionalLight.castShadow = true
	directionalLight.position.set(10, 150, 0)
	directionalLight.receiveShadow = true
	scene.add(directionalLight)

	window.addEventListener('resize', () => {
		// Обновляем размеры
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Обновляем соотношение сторон камеры
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		// Обновляем renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.render(scene, camera)
	})
	window.addEventListener('dblclick', () => {
		if (!document.fullscreenElement)
		{
			canvas.requestFullscreen()
		} else
		{
			document.exitFullscreen()
		}
	})

	return {sizes, scene, canvas, camera, renderer, controls}
}

export default init
