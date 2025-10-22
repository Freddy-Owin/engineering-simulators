export interface ThermodynamicState {
    pressure: number;
    volume: number; 
    temperature: number; 
    entropy: number; 
    enthalpy: number; 
}

export interface Process {
    id: string;
    type: 'isothermal' | 'adiabatic' | 'isobaric' | 'isochoric' | 'polytropic';
    startState: ThermodynamicState;
    endState: ThermodynamicState;
    work: number;
    heat: number;
    efficiency?: number;
}

export interface ThermodynamicCycle {
    id: string;
    name: string;
    type: 'carnot' | 'otto' | 'diesel' | 'brayton' | 'rankine';
    processes: Process[];
    workingFluid: WorkingFluid;
    efficiency: number;
    netWork: number;
    netHeat: number;
}

export interface WorkingFluid {
    id: string;
    name: string;
    type: 'ideal-gas' | 'real-gas' | 'steam';
    properties: {
        R: number;
        cp: number; 
        cv: number; 
        gamma: number;
    };
}

export interface SimulationParameters {
    pressureRatio: number;
    temperatureRatio: number;
    compressionRatio: number;
    cutOffRatio?: number; 
    isentropicEfficiency: number;
    massFlowRate: number;
}

export interface VisualizationState {
    currentCycle: ThermodynamicCycle;
    parameters: SimulationParameters;
    currentProcess: number;
    showProperties: boolean;
    diagramType: 'PV' | 'TS';
}