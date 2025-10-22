import type { ThermodynamicCycle, Process, WorkingFluid } from '../types/thermodynamics.types';
import { IdealGas } from './gasLaws';

export class CycleCalculator {
    static calculateCarnotCycle(
        T_hot: number,
        T_cold: number,
        V_max: number,
        V_min: number,
        fluid: WorkingFluid
    ): ThermodynamicCycle {
        const gamma = fluid.properties.gamma;
        const R = fluid.properties.R;
        const cv = fluid.properties.cv;

        const P1 = IdealGas.calculatePressure(V_min, T_hot, R);
        const P2 = IdealGas.calculatePressure(V_max, T_hot, R);
        const Q_in = R * T_hot * Math.log(V_max / V_min);
        const W_1_2 = Q_in;

        const V3 = V_max * Math.pow(T_hot / T_cold, 1 / (gamma - 1));
        const P3 = IdealGas.calculatePressure(V3, T_cold, R);
        const W_2_3 = cv * (T_hot - T_cold);

        const V4 = V_min;
        const P4 = IdealGas.calculatePressure(V_min, T_cold, R);
        const Q_out = R * T_cold * Math.log(V3 / V4);
        const W_3_4 = Q_out;

        const W_4_1 = cv * (T_cold - T_hot);

        const processes: Process[] = [
            {
                id: '1-2',
                type: 'isothermal',
                startState: { pressure: P1, volume: V_min, temperature: T_hot, entropy: 0, enthalpy: 0 },
                endState: { pressure: P2, volume: V_max, temperature: T_hot, entropy: Q_in / T_hot, enthalpy: 0 },
                work: W_1_2,
                heat: Q_in
            },
            {
                id: '2-3',
                type: 'adiabatic',
                startState: { pressure: P2, volume: V_max, temperature: T_hot, entropy: Q_in / T_hot, enthalpy: 0 },
                endState: { pressure: P3, volume: V3, temperature: T_cold, entropy: Q_in / T_hot, enthalpy: 0 },
                work: W_2_3,
                heat: 0
            },
            {
                id: '3-4',
                type: 'isothermal',
                startState: { pressure: P3, volume: V3, temperature: T_cold, entropy: Q_in / T_hot, enthalpy: 0 },
                endState: { pressure: P4, volume: V4, temperature: T_cold, entropy: 0, enthalpy: 0 },
                work: W_3_4,
                heat: -Q_out
            },
            {
                id: '4-1',
                type: 'adiabatic',
                startState: { pressure: P4, volume: V4, temperature: T_cold, entropy: 0, enthalpy: 0 },
                endState: { pressure: P1, volume: V_min, temperature: T_hot, entropy: 0, enthalpy: 0 },
                work: W_4_1,
                heat: 0
            }
        ];

        const netWork = W_1_2 + W_2_3 + W_3_4 + W_4_1;
        const efficiency = 1 - T_cold / T_hot;

        return {
            id: 'carnot',
            name: 'Carnot Cycle',
            type: 'carnot',
            processes,
            workingFluid: fluid,
            efficiency,
            netWork,
            netHeat: Q_in - Q_out
        };
    }

    static calculateOttoCycle(
        compressionRatio: number,
        P1: number,
        T1: number,
        Q_in: number,
        fluid: WorkingFluid
    ): ThermodynamicCycle {
        const gamma = fluid.properties.gamma;
        const cv = fluid.properties.cv;
        const R = fluid.properties.R;

        const V1 = (R * T1) / P1;
        const V2 = V1 / compressionRatio;

        const T2 = T1 * Math.pow(compressionRatio, gamma - 1);
        const P2 = P1 * Math.pow(compressionRatio, gamma);
        const W_1_2 = cv * (T1 - T2);

        const T3 = T2 + Q_in / cv;
        const P3 = P2 * (T3 / T2);
        const Q_2_3 = Q_in;
        const W_2_3 = 0;

        const T4 = T3 / Math.pow(compressionRatio, gamma - 1);
        const P4 = P3 / Math.pow(compressionRatio, gamma);
        const W_3_4 = cv * (T3 - T4);

        const Q_4_1 = cv * (T1 - T4);
        const W_4_1 = 0;

        const processes: Process[] = [
            {
                id: '1-2',
                type: 'adiabatic',
                startState: { pressure: P1, volume: V1, temperature: T1, entropy: 0, enthalpy: 0 },
                endState: { pressure: P2, volume: V2, temperature: T2, entropy: 0, enthalpy: 0 },
                work: W_1_2,
                heat: 0
            },
            {
                id: '2-3',
                type: 'isochoric',
                startState: { pressure: P2, volume: V2, temperature: T2, entropy: 0, enthalpy: 0 },
                endState: { pressure: P3, volume: V2, temperature: T3, entropy: Q_in / T2, enthalpy: 0 },
                work: W_2_3,
                heat: Q_2_3
            },
            {
                id: '3-4',
                type: 'adiabatic',
                startState: { pressure: P3, volume: V2, temperature: T3, entropy: Q_in / T2, enthalpy: 0 },
                endState: { pressure: P4, volume: V1, temperature: T4, entropy: Q_in / T2, enthalpy: 0 },
                work: W_3_4,
                heat: 0
            },
            {
                id: '4-1',
                type: 'isochoric',
                startState: { pressure: P4, volume: V1, temperature: T4, entropy: Q_in / T2, enthalpy: 0 },
                endState: { pressure: P1, volume: V1, temperature: T1, entropy: 0, enthalpy: 0 },
                work: W_4_1,
                heat: -Q_4_1
            }
        ];

        const netWork = W_1_2 + W_2_3 + W_3_4 + W_4_1;
        const efficiency = 1 - 1 / Math.pow(compressionRatio, gamma - 1);

        return {
            id: 'otto',
            name: 'Otto Cycle',
            type: 'otto',
            processes,
            workingFluid: fluid,
            efficiency,
            netWork,
            netHeat: Q_2_3 - Q_4_1
        };
    }

    static calculateDieselCycle(
        compressionRatio: number,
        cutOffRatio: number,
        P1: number,
        T1: number,
        fluid: WorkingFluid
    ): ThermodynamicCycle {
        const gamma = fluid.properties.gamma;
        const cv = fluid.properties.cv;
        const cp = fluid.properties.cp;
        const R = fluid.properties.R;

        const V1 = (R * T1) / P1;
        const V2 = V1 / compressionRatio;

        const T2 = T1 * Math.pow(compressionRatio, gamma - 1);
        const P2 = P1 * Math.pow(compressionRatio, gamma);
        const W_1_2 = cv * (T1 - T2);

        const V3 = V2 * cutOffRatio;
        const T3 = T2 * cutOffRatio;
        const P3 = P2;
        const Q_2_3 = cp * (T3 - T2);
        const W_2_3 = P2 * (V3 - V2);

        const V4 = V1;
        const T4 = T3 * Math.pow(V3 / V4, gamma - 1);
        const P4 = P3 * Math.pow(V3 / V4, gamma);
        const W_3_4 = cv * (T3 - T4);

        const Q_4_1 = cv * (T1 - T4);
        const W_4_1 = 0;

        const processes: Process[] = [
            {
                id: '1-2',
                type: 'adiabatic',
                startState: { pressure: P1, volume: V1, temperature: T1, entropy: 0, enthalpy: 0 },
                endState: { pressure: P2, volume: V2, temperature: T2, entropy: 0, enthalpy: 0 },
                work: W_1_2,
                heat: 0
            },
            {
                id: '2-3',
                type: 'isobaric',
                startState: { pressure: P2, volume: V2, temperature: T2, entropy: 0, enthalpy: 0 },
                endState: { pressure: P3, volume: V3, temperature: T3, entropy: Q_2_3 / T2, enthalpy: 0 },
                work: W_2_3,
                heat: Q_2_3
            },
            {
                id: '3-4',
                type: 'adiabatic',
                startState: { pressure: P3, volume: V3, temperature: T3, entropy: Q_2_3 / T2, enthalpy: 0 },
                endState: { pressure: P4, volume: V4, temperature: T4, entropy: Q_2_3 / T2, enthalpy: 0 },
                work: W_3_4,
                heat: 0
            },
            {
                id: '4-1',
                type: 'isochoric',
                startState: { pressure: P4, volume: V4, temperature: T4, entropy: Q_2_3 / T2, enthalpy: 0 },
                endState: { pressure: P1, volume: V1, temperature: T1, entropy: 0, enthalpy: 0 },
                work: W_4_1,
                heat: -Q_4_1
            }
        ];

        const netWork = W_1_2 + W_2_3 + W_3_4 + W_4_1;
        const efficiency = 1 - (1 / Math.pow(compressionRatio, gamma - 1)) *
            (Math.pow(cutOffRatio, gamma) - 1) / (gamma * (cutOffRatio - 1));

        return {
            id: 'diesel',
            name: 'Diesel Cycle',
            type: 'diesel',
            processes,
            workingFluid: fluid,
            efficiency,
            netWork,
            netHeat: Q_2_3 - Q_4_1
        };
    }
}