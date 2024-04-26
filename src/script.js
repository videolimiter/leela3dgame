import * as THREE from 'three'
import TWEEN from 'three/examples/jsm/libs/tween.module'
import {
	STLLoader
} from 'three/examples/jsm/loaders/STLLoader'
import init from './init'
import './style.css'

const loader = new STLLoader()

const {
	sizes,
	camera,
	scene,
	canvas,
	controls,
	renderer
} = init()



const poleGroup = new THREE.Group()
const poleMeshes = []
let clickedCellIndex = -1
let selectedCells = []
loader.load('models/pole/cell.stl', ((geometry) => {
	//generate pole
	let index = 0
	for (let y = -3.5; y <= 3.5; y += 1)
	{
		for (let x = -4; x <= 4; x += 1)
		{
			const cellMaterial = new THREE.MeshPhongMaterial({
				color: 0xddf0f0
			})
			const cellMesh = new THREE.Mesh(geometry, cellMaterial)
			cellMesh.castShadow = true
			cellMesh.receiveShadow = true
			const flag = (y - 0.5) % 2 === 0 ? 1 : -1
			cellMesh.position.set(x * flag, 0, -y)
			cellMesh.index = index
			cellMesh.baseColor = {r: cellMaterial.color.r, g: cellMaterial.color.g, b: cellMaterial.color.b}

			cellMesh.basePosition = new THREE.Vector3(cellMesh.position.x, cellMesh.position.y, cellMesh.position.z)
			index += 1
			poleMeshes.push(cellMesh)

		}
	}
	poleGroup.add(...poleMeshes)
	poleGroup.castShadow = true
	poleGroup.receiveShadow = true
	scene.add(poleGroup)
}))

const mouse = new THREE.Vector2()
const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()

function onDocumentMouseMove(event) {
	event.preventDefault()
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}
window.addEventListener("mousemove", onDocumentMouseMove, false)

const resetCell = (index) => {
	clickedCellIndex = null
	poleGroup.children[index].material.color.set('yellow')
	console.log(poleGroup.children[index].baseColor)
	new TWEEN.Tween(poleGroup.children[index].material.color).to({
		r: poleGroup.children[index].baseColor.r,
		g: poleGroup.children[index].baseColor.g,
		b: poleGroup.children[index].baseColor.b
	},
		2750).easing(TWEEN.Easing.Exponential.InOut).start()

	new TWEEN.Tween(poleGroup.children[index].position).to({
		x: poleGroup.children[index].basePosition.x,
		y: 0,
		z: poleGroup.children[index].basePosition.z,
	},
		1000).easing(TWEEN.Easing.Exponential.In).start()
	new TWEEN.Tween(poleGroup.children[index].rotation).to({
		x: 0,
		y: 0,
		z: 0,
	},
		1000).easing(TWEEN.Easing.Exponential.InOut).start()
}

const handleClick = (event) => {
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(poleGroup.children)
	if (intersects.length > 0)
	{
		for (let i = 0; i < 1; i += 1)
		{
			if (selectedCells.some((obj) => obj.object.index === intersects[i].object.index))
			{

				resetCell(intersects[i].object.index)
				selectedCells = selectedCells.filter((item) => item.object.index !== intersects[i].object.index)

			} else
			{
				selectedCells.push(intersects[i])
				intersects[i].object.material.color.set('yellow')
				new TWEEN.Tween(intersects[i].object.material.color).to({r: 1, g: 0, b: 0},
					2000).easing(TWEEN.Easing.Exponential.InOut).start()

				clickedCellIndex = intersects[i].object.index

				new TWEEN.Tween(intersects[i].object.position).to({
					x: intersects[i].object.basePosition.x,
					y: intersects[i].object.basePosition.y + 1,
					z: intersects[i].object.basePosition.z,
				},
					2000).easing(TWEEN.Easing.Exponential.InOut).start()
			}
		}

	}
}
window.addEventListener("click", handleClick)

const animate = () => {
	controls.update()
	const delta = clock.getDelta()
	if (selectedCells.length > 0)
	{
		for (let i = 0; i < selectedCells.length; i += 1)
		{
			if ((selectedCells[i].object.rotation.y / Math.PI) * 180 > 360)
			{
				selectedCells[i].object.rotation.y -= 360 * Math.PI / 180
			} else
				selectedCells[i].object.rotation.y += (Math.PI / 180)
		}
	}

	TWEEN.update()
	renderer.render(scene, camera)
	window.requestAnimationFrame(animate)
}
animate()

/** Базовые обпаботчики событий длы поддержки ресайза */
