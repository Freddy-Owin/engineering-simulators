import type { GearCalculationResult } from "../types/gear.types";

export const calculateGearRatio = (driverTeeth: number, drivenTeeth: number): number => {
    return driverTeeth / drivenTeeth;
};

export const calculateRotationSpeed = (
    driverSpeed: number,
    driverTeeth: number,
    drivenTeeth: number
): number => {
    return -driverSpeed * (driverTeeth / drivenTeeth);
};

export const calculateTorqueRatio = (
    driverTeeth: number,
    drivenTeeth: number
): number => {
    return drivenTeeth / driverTeeth;
};

export const calculateGearProperties = (
    driverTeeth: number,
    drivenTeeth: number,
    driverSpeed: number = 1
): GearCalculationResult => {
    const ratio = calculateGearRatio(driverTeeth, drivenTeeth);
    const drivenSpeed = calculateRotationSpeed(driverSpeed, driverTeeth, drivenTeeth);
    const torqueRatio = calculateTorqueRatio(driverTeeth, drivenTeeth);

    return {
        ratio,
        drivenSpeed,
        torqueRatio,
        direction: drivenSpeed > 0 ? 'same' : 'opposite'
    };
};

export const calculateGearRadius = (teeth: number, module: number = 0.1): number => {
    return (teeth * module) / 2;
};

export const generateGearPositions = (gears: { teeth: number }[], spacing: number = 0.5): { x: number; y: number; z: number }[] => {
    const positions = [];
    let currentX = 0;

    for (let i = 0; i < gears.length; i++) {
        const radius = calculateGearRadius(gears[i].teeth);
        positions.push({
            x: currentX,
            y: 0,
            z: 0
        });

        if (i < gears.length - 1) {
            const nextRadius = calculateGearRadius(gears[i + 1].teeth);
            currentX += radius + nextRadius + spacing;
        }
    }

    return positions;
};