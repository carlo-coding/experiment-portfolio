import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Flex, Box, useReflow } from "@react-three/flex";
import { Html, OrbitControls, PresentationControls, Text } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getQuadrant } from "./utils";
import WordCloud from "./WordCloud";

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
                    <Effect />
                </Canvas>
                <div 
                className="scrollArea"
                onScroll={e=>setTop(e.target.scrollTop)}
            >
                <div style={{height: `${pages*100}vh`}}></div>
            </div>
            </Suspense>
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
        <group ref={ref} >
            <Flex 
                flexDirection="row"
                position={[-viewport.width/2, viewport.height/2, 0]}
                size={[viewport.width, viewport.height, 0]}
                onReflow={(w, h)=> onReflow(h / viewport.height)}
            >
                <TestLayout />
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
    const { viewport, size } = useThree();

    const reflow = useReflow();

    const shapeRef = useRef(null);
    const [cloudOrigin, setCloudOrigin] = useState(new THREE.Vector3(0,0,0));

    useEffect(()=> {
        let newOrigin = new THREE.Vector3(10,0,0);
        newOrigin.add(shapeRef.current?.position||newOrigin);
        newOrigin.setZ(-40);             
        console.log("newOrigin", newOrigin)
        console.log("shapeRef.current.position", shapeRef.current?.position)
        setCloudOrigin(newOrigin)
    }, [shapeRef.current])

    return (
        <Box width="100%" height="100%" flexDirection="row" flexWrap="wrap">
            <Box width="50%" height="100%" minWidth="300px" centerAnchor>
                {(w, h)=> (
                    <Text 
                        fontSize={Math.max(w/20, 0.15)}
                        maxWidth={w}
                        textAlign="center"
                        onSync={reflow}
                    >
                        Mi nombre es Jaan Carlo
                        Programador full stack.
                            Centrado en crear interfaces con React.js
                    </Text>
                )}
            </Box>
            <Box width="50%" height="100%" ref={shapeRef} centerAnchor>
                {(w, h)=> {
                    return (<WordCloud  contWidth={w}/>)
                }}
            </Box>
            
        </Box>
    )
}

function Effect() {
    return (
        <EffectComposer>
            <Glitch 
            
            />
        </EffectComposer>
    )
}