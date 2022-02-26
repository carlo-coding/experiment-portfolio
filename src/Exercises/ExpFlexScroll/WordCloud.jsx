import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, TrackballControls } from '@react-three/drei'
import randomWord from 'random-words'


const words = [
  "Typescript",
  "React.js",
  "Next.js",
  "Material UI",
  "Formik",
  "Yup",
  "Three React Fiber",
  "Blender",
  "Figma",
  "Sass",
  "Node.js"
]

export function * wordsGenerator() {
  let index = 0;
  while (true) {
      if (index > (words.length-1)) {
          index = 0;
      }
      yield words[index];
      index++;
  }
}

function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)
  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => {document.body.style.cursor = 'auto'}
  }, [hovered])
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    if(!ref.current) return 
    // Make text face the camera
    ref.current.quaternion.copy(camera.quaternion)
    // Animate font color
    ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
  })
  return <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps} children={children} />
}

function Cloud({ count = 4, radius = 20 }) {
  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp = []
    const wgen = wordsGenerator();
    /* 
    por cada          
    */
    const phiSpan = Math.PI / (count + 1) // * i    36deg   1, 2, 3, 4
    const thetaSpan = (Math.PI * 2) / (count)  // * j 90deg   0, 1, 2, 3
    for (let i = 1; i < count + 1; i++){
      // Taken from https://discourse.threejs.org/t/can-i-place-obects-on-a-sphere-surface-evenly/4773/6
      for (let j = 0; j < count; j++) {
        //console.log(`coords: (r: ${radius}, phi: ${phiSpan * i}, theta: ${thetaSpan * j}})`)
        temp.push([
          (new THREE.Vector3().setFromSphericalCoords(radius, phiSpan * i, thetaSpan * j)), 
          wgen.next().value
        ])
      }
    }
    return temp
  }, [count, radius])
  return <>
    { words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />) }
  </>
}

export default function WordCloud({ contWidth }) {

  const cloudRef = useRef(null);

  useFrame(({ clock })=> {
    cloudRef.current.rotation.x = Math.sin(clock.getElapsedTime()/4)/8
    cloudRef.current.rotation.y = Math.cos(clock.getElapsedTime()/4)/8
    cloudRef.current.rotation.z = Math.cos(clock.getElapsedTime()/4)/8
  })

  return (
    <group ref={cloudRef} position={[contWidth*8.5, 0, -50]} >
        <Cloud />
    </group>
  )
} 