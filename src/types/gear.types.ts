export interface Gear {
    id: string;
    teeth: number;
    radius: number;
    position: { x: number; y: number; z: number };
    rotation: number;
    color: string;
    speed: number;
    name: string;
}

export interface GearPair {
    driver: Gear;
    driven: Gear;
    ratio: number;
    torqueRatio: number;
}

export interface SimulationState {
    gears: Gear[];
    pairs: GearPair[];
    isRunning: boolean;
    speed: number;
}

export interface GearCalculationResult {
    ratio: number;
    drivenSpeed: number;
    torqueRatio: number;
    direction: 'same' | 'opposite';
}