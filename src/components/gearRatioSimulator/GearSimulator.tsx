import React, { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import Gear3D from './Gear3D';
import type { Gear, GearPair, SimulationState } from '../../types/gear.types';
import { calculateGearRadius, calculateGearRatio, calculateTorqueRatio, generateGearPositions } from '../../utils/gearCalculation';
import ControlsPanel from './ControlsPanel';
import RatioDisplay from './RatioDisplay';


const GearSimulator: React.FC = () => {
    const [state, setState] = useState<SimulationState>({
        gears: [
            {
                id: 'gear1',
                teeth: 20,
                radius: calculateGearRadius(20),
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                color: '#ff6b6b',
                speed: 1,
                name: 'Driver Gear'
            },
            {
                id: 'gear2',
                teeth: 40,
                radius: calculateGearRadius(40),
                position: { x: 3, y: 0, z: 0 },
                rotation: 0,
                color: '#4ecdc4',
                speed: 0,
                name: 'Driven Gear'
            }
        ],
        pairs: [],
        isRunning: false,
        speed: 1
    });

    const gearPairs = useMemo((): GearPair[] => {
        const pairs: GearPair[] = [];

        for (let i = 0; i < state.gears.length - 1; i++) {
            const driver = state.gears[i];
            const driven = state.gears[i + 1];

            pairs.push({
                driver,
                driven,
                ratio: calculateGearRatio(driver.teeth, driven.teeth),
                torqueRatio: calculateTorqueRatio(driver.teeth, driven.teeth)
            });
        }

        return pairs;
    }, [state.gears]);

    const updateGearPositions = useCallback((gears: Gear[]): Gear[] => {
        const positions = generateGearPositions(gears);
        return gears.map((gear, index) => ({
            ...gear,
            position: positions[index],
            radius: calculateGearRadius(gear.teeth)
        }));
    }, []);

    const handleAddGear = (teeth: number) => {
        const newGear: Gear = {
            id: `gear${state.gears.length + 1}`,
            teeth,
            radius: calculateGearRadius(teeth),
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            color: `hsl(${state.gears.length * 45 % 360}, 70%, 60%)`,
            speed: 0,
            name: `Gear ${state.gears.length + 1}`
        };

        setState(prev => ({
            ...prev,
            gears: updateGearPositions([...prev.gears, newGear])
        }));
    };

    const handleRemoveGear = (id: string) => {
        if (state.gears.length <= 2) return;

        const filteredGears = state.gears.filter(gear => gear.id !== id);
        setState(prev => ({
            ...prev,
            gears: updateGearPositions(filteredGears)
        }));
    };

    const handleUpdateGear = (id: string, teeth: number) => {
        const updatedGears = state.gears.map(gear =>
            gear.id === id
                ? { ...gear, teeth, radius: calculateGearRadius(teeth) }
                : gear
        );

        setState(prev => ({
            ...prev,
            gears: updateGearPositions(updatedGears)
        }));
    };

    const handleSpeedChange = (speed: number) => {
        setState(prev => ({ ...prev, speed }));
    };

    const toggleSimulation = () => {
        setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
    };

    const getGearRotationSpeed = (gear: Gear, index: number): number => {
        if (index === 0) {
            return state.speed * (state.isRunning ? 1 : 0);
        }

        let currentSpeed = state.speed;
        for (let i = 0; i < index; i++) {
            const ratio = calculateGearRatio(state.gears[i].teeth, state.gears[i + 1].teeth);
            currentSpeed *= ratio;
        }

        return currentSpeed * (index % 2 === 0 ? 1 : -1) * (state.isRunning ? 1 : 0);
    };

    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-gray-900">
            <div className="flex-1 relative">
                <Canvas shadows camera={{ position: [0, 8, 12], fov: 50 }}>
                    <color attach="background" args={['#1a202c']} />

                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />

                    <gridHelper args={[20, 20, '#4a5568', '#4a5568']} rotation={[0, 0, 0]} />
                    <axesHelper args={[5]} />

                    {state.gears.map((gear, index) => (
                        <group key={gear.id}>
                            <Gear3D
                                teeth={gear.teeth}
                                radius={gear.radius}
                                position={[gear.position.x, gear.position.y, gear.position.z]}
                                rotationSpeed={getGearRotationSpeed(gear, index)}
                                color={gear.color}
                                isRotating={state.isRunning}
                                name={gear.name}
                            />

                            <Text
                                position={[gear.position.x, gear.position.y - gear.radius - 0.5, gear.position.z]}
                                color="white"
                                fontSize={0.3}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {gear.name} ({gear.teeth}t)
                            </Text>
                        </group>
                    ))}

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={20}
                    />
                    <Environment preset="dawn" />
                </Canvas>

                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                    <div className="text-sm">
                        <div>Gears: {state.gears.length}</div>
                        <div>Status: {state.isRunning ? 'Running' : 'Paused'}</div>
                        <div>Speed: {state.speed}x</div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-96 bg-gray-800 text-white p-6 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">3D Gear Ratio Simulator</h1>
                    <p className="text-gray-300 mt-2">
                        Visualize gear ratios, torque, and rotational dynamics in 3D
                    </p>
                </div>

                <ControlsPanel
                    gears={state.gears}
                    isRunning={state.isRunning}
                    speed={state.speed}
                    onAddGear={handleAddGear}
                    onSpeedChange={handleSpeedChange}
                    onToggle={toggleSimulation}
                    onRemoveGear={handleRemoveGear}
                    onUpdateGear={handleUpdateGear}
                />

                <div className="mt-6">
                    <RatioDisplay pairs={gearPairs} />
                </div>
            </div>
        </div>
    );
};

export default GearSimulator;