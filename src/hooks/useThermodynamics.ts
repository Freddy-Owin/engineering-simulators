import { useState, useCallback } from 'react';
import type { ThermodynamicCycle, SimulationParameters, WorkingFluid } from '../types/thermodynamics.types';
import { CycleCalculator } from '../utils/cycleCalculations';

export const useThermodynamics = () => {
    const [currentCycle, setCurrentCycle] = useState<ThermodynamicCycle | null>(null);
    const [parameters, setParameters] = useState<SimulationParameters>({
        pressureRatio: 8,
        temperatureRatio: 4,
        compressionRatio: 10,
        isentropicEfficiency: 0.85,
        massFlowRate: 1
    });

    const workingFluids: WorkingFluid[] = [
        {
            id: 'air',
            name: 'Air',
            type: 'ideal-gas',
            properties: {
                R: 0.287,
                cp: 1.005,
                cv: 0.718,
                gamma: 1.4
            }
        },
        {
            id: 'helium',
            name: 'Helium',
            type: 'ideal-gas',
            properties: {
                R: 2.077,
                cp: 5.193,
                cv: 3.116,
                gamma: 1.67
            }
        },
        {
            id: 'argon',
            name: 'Argon',
            type: 'ideal-gas',
            properties: {
                R: 0.208,
                cp: 0.520,
                cv: 0.312,
                gamma: 1.67
            }
        }
    ];

    const calculateCycle = useCallback((cycleType: string, fluidId: string = 'air') => {
        const fluid = workingFluids.find(f => f.id === fluidId) || workingFluids[0];
        const T1 = 300;
        const P1 = 100; 

        let cycle: ThermodynamicCycle;

        switch (cycleType) {
            case 'carnot':
                cycle = CycleCalculator.calculateCarnotCycle(
                    T1 * parameters.temperatureRatio,
                    T1,
                    0.1,
                    0.01,
                    fluid
                );
                break;
            case 'otto':
                cycle = CycleCalculator.calculateOttoCycle(
                    parameters.compressionRatio,
                    P1,
                    T1,
                    800,
                    fluid
                );
                break;
            case 'diesel':
                cycle = CycleCalculator.calculateDieselCycle(
                    parameters.compressionRatio,
                    2,
                    P1,
                    T1,
                    fluid
                );
                break;
            default:
                cycle = CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, fluid);
        }

        setCurrentCycle(cycle);
        return cycle;
    }, [parameters, workingFluids]);

    const updateParameter = useCallback((param: keyof SimulationParameters, value: number) => {
        setParameters(prev => ({ ...prev, [param]: value }));
    }, []);

    return {
        currentCycle,
        parameters,
        workingFluids,
        calculateCycle,
        updateParameter,
        setCurrentCycle
    };
};