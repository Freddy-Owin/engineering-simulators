// src/components/thermodynamics/Cycle3DVisualizer.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, TubeGeometry, Vector3, CatmullRomCurve3 } from 'three';
import type { ThermodynamicCycle } from '../../types/thermodynamics.types';

interface Cycle3DVisualizerProps {
    cycle: ThermodynamicCycle;
    isPlaying: boolean;
    speed: number;
    currentProcess: number;
}

const Cycle3DVisualizer: React.FC<Cycle3DVisualizerProps> = ({
    cycle,
    isPlaying,
    speed,
}) => {
    const groupRef = useRef<Group>(null);

    const cyclePath = useMemo(() => {
        const points: Vector3[] = [];

        cycle.processes.forEach((process) => {
            const start = process.startState;
            const end = process.endState;

            const startPoint = new Vector3(
                start.volume * 10,          
                start.pressure / 100,       
                start.temperature / 100      
            );

            const endPoint = new Vector3(
                end.volume * 10,
                end.pressure / 100,
                end.temperature / 100
            );

            points.push(startPoint);

            const segments = 5;
            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const point = new Vector3().lerpVectors(startPoint, endPoint, t);
                points.push(point);
            }
        });

        const firstPoint = new Vector3(
            cycle.processes[0].startState.volume * 10,
            cycle.processes[0].startState.pressure / 100,
            cycle.processes[0].startState.temperature / 100
        );
        points.push(firstPoint);

        return new CatmullRomCurve3(points);
    }, [cycle]);

    const tubeGeometry = useMemo(() => {
        return new TubeGeometry(cyclePath, 100, 0.05, 8, false);
    }, [cyclePath]);

    const statePoints = useMemo(() => {
        return cycle.processes.flatMap(process => [process.startState]);
    }, [cycle]);

    useFrame((_state, delta) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += delta * speed * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh geometry={tubeGeometry}>
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
            </mesh>

            {statePoints.map((state, index) => (
                <mesh
                    key={index}
                    position={[
                        state.volume * 10,
                        state.pressure / 100,
                        state.temperature / 100
                    ]}
                >
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshBasicMaterial color="#ef4444" />
                </mesh>
            ))}

            <group>
                <mesh position={[5, -2, -2]}>
                    <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                <mesh position={[-2, 2.5, -2]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.02, 0.02, 5, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                <mesh position={[-2, -2, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 5, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            </group>

            <group>
                <mesh position={[6, -2.5, -2]}>
                    <planeGeometry args={[1, 0.2]} />
                    <meshBasicMaterial color="#3b82f6" />
                </mesh>

                <mesh position={[-2.5, 3, -2]} rotation={[0, 0, Math.PI / 2]}>
                    <planeGeometry args={[1, 0.2]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>

                <mesh position={[-2.5, -2, 3]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1, 0.2]} />
                    <meshBasicMaterial color="#ef4444" />
                </mesh>
            </group>
        </group>
    );
};

export default Cycle3DVisualizer;