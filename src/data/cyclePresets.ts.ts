import type { SimulationParameters } from '../types/thermodynamics.types';

export const cyclePresets: Record<string, SimulationParameters> = {
    highEfficiency: {
        pressureRatio: 15,
        temperatureRatio: 6,
        compressionRatio: 12,
        isentropicEfficiency: 0.92,
        massFlowRate: 1.2
    },
    standard: {
        pressureRatio: 8,
        temperatureRatio: 4,
        compressionRatio: 10,
        isentropicEfficiency: 0.85,
        massFlowRate: 1
    },
    highPerformance: {
        pressureRatio: 18,
        temperatureRatio: 7,
        compressionRatio: 14,
        isentropicEfficiency: 0.88,
        massFlowRate: 1.5
    },
    economic: {
        pressureRatio: 6,
        temperatureRatio: 3,
        compressionRatio: 8,
        isentropicEfficiency: 0.82,
        massFlowRate: 0.8
    }
};

export const cycleDescriptions = {
    carnot: {
        name: 'Carnot Cycle',
        description: 'The most efficient possible thermodynamic cycle, consisting of two isothermal and two adiabatic processes.',
        applications: 'Theoretical maximum efficiency reference',
        efficiency: '1 - T_cold/T_hot'
    },
    otto: {
        name: 'Otto Cycle',
        description: 'The ideal cycle for spark-ignition internal combustion engines, with constant volume heat addition.',
        applications: 'Gasoline engines, automotive engines',
        efficiency: '1 - 1/r^(γ-1)'
    },
    diesel: {
        name: 'Diesel Cycle',
        description: 'The ideal cycle for compression-ignition engines, with constant pressure heat addition.',
        applications: 'Diesel engines, heavy machinery',
        efficiency: '1 - (1/r^(γ-1)) * (ρ^γ - 1)/(γ(ρ - 1))'
    },
    brayton: {
        name: 'Brayton Cycle',
        description: 'The ideal cycle for gas turbine engines, with constant pressure heat addition and rejection.',
        applications: 'Jet engines, power plants',
        efficiency: '1 - 1/r_p^((γ-1)/γ)'
    },
    rankine: {
        name: 'Rankine Cycle',
        description: 'The ideal cycle for steam power plants, using phase change of working fluid.',
        applications: 'Steam turbines, nuclear power plants',
        efficiency: 'Depends on turbine and pump efficiencies'
    }
};