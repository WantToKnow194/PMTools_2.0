import React, { useState, useRef, useMemo } from "react";
import styles from './DynamicLogo.module.scss';
import * as THREE from 'three'

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from '@react-three/drei';
import { SphereGeometry } from "three";
import setArc3D from "./SetArc3D";
 
const Sphere = (props: JSX.IntrinsicElements['mesh']) => {

  const ref = useRef<THREE.Mesh>(null!);

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const [sphereRadius, setSphereRadius] = useState(2);

  useFrame((state, delta) => (ref.current.rotation.y += 0.001));

  const pointStart = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(sphereRadius);
  const pointEnd = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(sphereRadius);

  const newArc1 = setArc3D(pointStart, pointEnd, 50, "lime", false);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 2 : 1}
      // onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[2, 32, 16]}/>
      <meshLambertMaterial color={hovered ? '#ce93d8' : '#90caf9'} wireframe />
      <Line points={newArc1} color='lime' linewidth={2} alphaWrite={undefined}/>
      <OrbitControls 
        minDistance={4}
        maxDistance={8}
        enablePan={false}
      />
    </mesh>
  );
}


const DynamicLogo = () => {
  const [color, colorChange] = useState("blue"); // Состояние отвечает за цвет квадрата
 
  // Handler служит для того, чтобы
  const colorChangeHandler = () => {
    // Просто поочерёдно меняем цвет с серого на синий и с синего на белый
    colorChange((prevColor) => (prevColor === "white" ? "blue" : "white"));
  };
 
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Sphere position={[0, 0, 0]} />
    </Canvas>
  );
};
 
export default DynamicLogo;