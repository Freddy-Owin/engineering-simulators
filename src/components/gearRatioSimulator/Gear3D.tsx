import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ExtrudeGeometry, Vector2, Shape } from 'three';


interface Gear3DProps {
    teeth: number;
    radius: number;
    position: [number, number, number];
    rotationSpeed: number;
    color: string;
    isRotating: boolean;
    name: string;
}

const Gear3D: React.FC<Gear3DProps> = ({
    teeth,
    radius,
    position,
    rotationSpeed,
    color,
    isRotating,
}) => {
    const meshRef = useRef<Mesh>(null);

    useFrame((_state, delta) => {
        if (meshRef.current && isRotating) {
            meshRef.current.rotation.z += rotationSpeed * delta;
        }
    });

    const gearGeometry = useMemo(() => {
        const shape = new Shape();
        const toothDepth = radius * 0.2;
        const toothSlope = 0.2;

        const angleStep = (2 * Math.PI) / teeth;

        const startAngle = -angleStep / 2;
        const startPoint = new Vector2(
            Math.cos(startAngle) * (radius - toothDepth),
            Math.sin(startAngle) * (radius - toothDepth)
        );
        shape.moveTo(startPoint.x, startPoint.y);

        for (let i = 0; i < teeth; i++) {
            const angle1 = i * angleStep;
            const angle2 = angle1 + angleStep * toothSlope;
            const angle3 = angle1 + angleStep * (1 - toothSlope);
            const angle4 = angle1 + angleStep;

            const toothOuter = new Vector2(
                Math.cos(angle1) * (radius + toothDepth),
                Math.sin(angle1) * (radius + toothDepth)
            );

            const toothSide1 = new Vector2(
                Math.cos(angle2) * radius,
                Math.sin(angle2) * radius
            );

            const toothSide2 = new Vector2(
                Math.cos(angle3) * radius,
                Math.sin(angle3) * radius
            );

            const nextValley = new Vector2(
                Math.cos(angle4) * (radius - toothDepth),
                Math.sin(angle4) * (radius - toothDepth)
            );

            shape.lineTo(toothOuter.x, toothOuter.y);
            shape.lineTo(toothSide1.x, toothSide1.y);
            shape.lineTo(toothSide2.x, toothSide2.y);
            shape.lineTo(nextValley.x, nextValley.y);
        }

        shape.closePath();

        const centerHole = new Shape();
        centerHole.absarc(0, 0, radius * 0.3, 0, Math.PI * 2);
        shape.holes.push(centerHole);

        const extrudeSettings = {
            depth: radius * 0.3,
            bevelEnabled: true,
            bevelThickness: radius * 0.05,
            bevelSize: radius * 0.03,
            bevelOffset: 0,
            bevelSegments: 3
        };

        return new ExtrudeGeometry(shape, extrudeSettings);
    }, [teeth, radius]);

    return (
        <group position={position}>
            <mesh ref={meshRef} geometry={gearGeometry} castShadow receiveShadow>
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.7}
                />
            </mesh>

            <mesh position={[0, 0, radius * 0.35]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius * 0.9, radius * 0.9, radius * 0.05, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
};

export default Gear3D;