import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Flex, Box, useReflow } from "@react-three/flex";
import { OrbitControls, PresentationControls, Text } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getQuadrant } from "./utils";


const id = ()=> Math.random().toString(16).slice(2);


export default function Main () {
    const [top, setTop] = useState(0);
    const [pages, setPages] = useState(2);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    function handleMouse(event) {
        setMouse({x: event.clientX, y: event.clientY})
    }

    return (
        <React.Fragment>
            <Suspense fallback={null}>
                <Canvas 
                    dpr={window.devicePixelRatio} 
                    camera={{fov: 75, position: [0, 0, 3]}}
                    className="three-canvas"
                >
                    <ambientLight />
                    <Content onReflow={setPages} top={top} mouse={mouse}/>
                </Canvas>
            </Suspense>
            <div 
                className="scrollArea"
                onScroll={e=>setTop(e.target.scrollTop)}
                onPointerMove={e=>console.log("[debug] moving cursor over <div>")}
            >
                <div style={{height: `${pages*100}vh`}}></div>
            </div>
        </React.Fragment>
    )
}

function Content({ onReflow, top, mouse }) {
    const { size, viewport } = useThree();
    const ref = useRef(null);
    const vec = new THREE.Vector3();

    useFrame(({ clock })=> {
        const page = top / size.height; // Cuantas páginas se han desplazado
        const y = page * viewport.height; // Desplazamiento en medidas de threejs
        ref.current.position.lerp(vec.set(0,y,0), 0.2);

        /*const angles = getQuadrant(size.width, size.height, mouse.x, mouse.y)
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, angles.x, 0.01)
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, angles.y, 0.01)*/
    });


    return (
        <group ref={ref} onPointerMove={e=>console.log("[debug] moving cursor over canvas")}>
            <Flex 
                flexDirection="row"
                flexWrap="wrap"
                position={[-viewport.width/2, viewport.height/2, -0.5]}
                size={[viewport.width, viewport.height, 0]}
                onReflow={(w, h)=> onReflow(h / viewport.height)}
            >
                <BoxesYep />
            </Flex>
        </group>
    )
}

const imageBoxStyles = {
    width: "170px",
    height: "170px",
    margin: 0.05,
}


function TestLayout() {
    const images = (new Array(3).fill(null)).map((_,i)=>`https://picsum.photos/300/300?random=${i}`);
    const textures = useLoader(THREE.TextureLoader, images) 

    const { viewport, size } = useThree();

    const reflow = useReflow();

    return (
        <>
        <Box flexDirection="column" width="100%">
            <Box marginLeft={viewport.width*0.25} width="100%">
                <Text 
                    fontSize={0.5} 
                    anchorX="center" 
                    anchorY="center" 
                    maxWidth={viewport.width*0.5}
                    textAlign="rigth"
                    onSync={reflow}
                >
                    Hola, mi nombre es Juliano melano 
                </Text>
            </Box>
            <Box width="100%" flexDirection="row" flexWrap="wrap" justifyContent="flex-end">
                {textures.map((texture, index)=> (
                    <Box {...imageBoxStyles} key={index} centerAnchor>
                        {(w, h)=> (
                            <mesh>
                                <planeBufferGeometry args={[w, h]}/>
                                <meshBasicMaterial map={texture} toneMapped={false}/>
                            </mesh>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
        </>
    )
}

function BoxesYep() {
    const images = (new Array(20).fill(null)).map((_,i)=>`https://picsum.photos/300/300?random=${i}`);
    const textures = useLoader(THREE.TextureLoader, images)
    return <>
    {textures.map((texture, index)=> (
        <Box {...imageBoxStyles} key={index} centerAnchor>
            {(w, h)=> (
                <mesh>
                    <planeBufferGeometry args={[w, h]}/>
                    <meshBasicMaterial map={texture} toneMapped={false}/>
                </mesh>
            )}
        </Box>
    ))}
        </>
}

function Effect() {
    return (
        <EffectComposer>
            <Glitch 
            
            />
        </EffectComposer>
    )
}