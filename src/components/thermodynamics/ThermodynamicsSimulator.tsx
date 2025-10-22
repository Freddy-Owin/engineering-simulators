import React, { useState, useMemo, useEffect } from 'react';
import PVDiagram from './PVDiagram';
import TSDiagram from './TSDiagram';
import CycleControls from './CycleControls';
import PropertiesPanel from './PropertiesPanel';
import type { ThermodynamicCycle, SimulationParameters, VisualizationState, WorkingFluid } from '../../types/thermodynamics.types';
import { CycleCalculator } from '../../utils/cycleCalculations';

const ThermodynamicsSimulator: React.FC = () => {
    const [state, setState] = useState<VisualizationState>({
        currentCycle: null!,
        parameters: {
            pressureRatio: 8,
            temperatureRatio: 4,
            compressionRatio: 10,
            isentropicEfficiency: 0.85,
            massFlowRate: 1
        },
        currentProcess: 0,
        showProperties: true,
        diagramType: 'PV'
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
        }
    ];

    useEffect(() => {
        const initialCycle = CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, workingFluids[0]);
        setState(prev => ({ ...prev, currentCycle: initialCycle }));
    }, []);

    const currentCycle = useMemo(() => {
        if (!state.currentCycle) {
            return CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, workingFluids[0]);
        }

        const fluid = workingFluids[0];
        const T1 = 300;
        const P1 = 100;

        switch (state.currentCycle?.type) {
            case 'carnot':
                return CycleCalculator.calculateCarnotCycle(
                    T1 * state.parameters.temperatureRatio,
                    T1,
                    0.1,
                    0.01,
                    fluid
                );
            case 'otto':
                return CycleCalculator.calculateOttoCycle(
                    state.parameters.compressionRatio,
                    P1,
                    T1,
                    800,
                    fluid
                );
            case 'diesel':
                return CycleCalculator.calculateDieselCycle(
                    state.parameters.compressionRatio,
                    2,
                    P1,
                    T1,
                    fluid
                );
            default:
                return CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, fluid);
        }
    }, [state.parameters, state.currentCycle]);

    const handleCycleChange = (cycleType: ThermodynamicCycle['type']) => {
        const fluid = workingFluids[0];
        let newCycle: ThermodynamicCycle;

        switch (cycleType) {
            case 'carnot':
                newCycle = CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, fluid);
                break;
            case 'otto':
                newCycle = CycleCalculator.calculateOttoCycle(10, 100, 300, 800, fluid);
                break;
            case 'diesel':
                newCycle = CycleCalculator.calculateDieselCycle(10, 2, 100, 300, fluid);
                break;
            default:
                newCycle = CycleCalculator.calculateCarnotCycle(600, 300, 0.1, 0.01, fluid);
        }

        setState(prev => ({
            ...prev,
            currentCycle: newCycle
        }));
    };

    const handleParameterChange = (param: keyof SimulationParameters, value: number) => {
        setState(prev => ({
            ...prev,
            parameters: { ...prev.parameters, [param]: value }
        }));
    };

    if (!currentCycle) {
        return (
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-linear-to-br from-gray-900 to-blue-900 flex flex-col overflow-hidden">
            <header className="bg-gray-800/90 border-b border-gray-700 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs">🔥</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white">Thermodynamics Visualizer</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                        <div className="text-center">
                            <div className="text-gray-400">Eff.</div>
                            <div className="text-green-400 font-bold">{(currentCycle.efficiency * 100).toFixed(1)}%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-400">Work</div>
                            <div className="text-blue-400 font-bold">{currentCycle.netWork.toFixed(1)} kJ</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600">
                        <h3 className="text-xs font-semibold text-white mb-1">Cycle Type</h3>
                        <div className="flex gap-1">
                            {['carnot', 'otto', 'diesel'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleCycleChange(type as ThermodynamicCycle['type'])}
                                    className={`flex-1 px-1 py-1 rounded text-xs border transition-all ${state.currentCycle?.type === type
                                            ? 'bg-blue-500 border-blue-400 text-white'
                                            : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600">
                        <h3 className="text-xs font-semibold text-white mb-1">Diagram</h3>
                        <div className="flex gap-1">
                            {[
                                { type: 'PV', label: 'P-V' },
                                { type: 'TS', label: 'T-S' }
                            ].map(({ type, label }) => (
                                <button
                                    key={type}
                                    onClick={() => setState(prev => ({ ...prev, diagramType: type as any }))}
                                    className={`flex-1 px-1 py-1 rounded text-xs border transition-all ${state.diagramType === type
                                            ? 'bg-purple-500 border-purple-400 text-white'
                                            : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600">
                        <h3 className="text-xs font-semibold text-white mb-1">Performance</h3>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="bg-green-500/10 p-1 rounded border border-green-500/20">
                                <div className="text-[10px] text-gray-400">Eff.</div>
                                <div className="text-xs font-bold text-green-400">{(currentCycle.efficiency * 100).toFixed(1)}%</div>
                            </div>
                            <div className="bg-blue-500/10 p-1 rounded border border-blue-500/20">
                                <div className="text-[10px] text-gray-400">Work</div>
                                <div className="text-xs font-bold text-blue-400">{currentCycle.netWork.toFixed(1)}</div>
                            </div>
                            <div className="bg-yellow-500/10 p-1 rounded border border-yellow-500/20">
                                <div className="text-[10px] text-gray-400">Cycle</div>
                                <div className="text-xs font-bold text-yellow-400 capitalize">{currentCycle.type}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600">
                        <h3 className="text-xs font-semibold text-white mb-1">Info</h3>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <div>
                                <div className="text-gray-400">Fluid</div>
                                <div className="text-white">{workingFluids[0].name}</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Processes</div>
                                <div className="text-white">{currentCycle.processes.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-2 min-h-0">
                    <div className="xl:col-span-3 bg-gray-800/80 rounded-lg border border-gray-600 overflow-hidden">
                        <div className="h-full flex flex-col">
                            <div className="px-3 py-1 border-b border-gray-600">
                                <h3 className="text-sm font-semibold text-white">
                                    {state.diagramType === 'PV' ? 'Pressure-Volume Diagram' : 'Temperature-Entropy Diagram'}
                                </h3>
                            </div>
                            <div className="flex-1 p-2">
                                {state.diagramType === 'PV' ? (
                                    <PVDiagram
                                        cycle={currentCycle}
                                        currentProcess={state.currentProcess}
                                    />
                                ) : (
                                    <TSDiagram
                                        cycle={currentCycle}
                                        currentProcess={state.currentProcess}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-1 flex flex-col gap-2 min-h-0">
                        <div className="flex-1 min-h-0">
                            <CycleControls
                                parameters={state.parameters}
                                onParameterChange={handleParameterChange}
                            />
                        </div>

                        <div className="flex-1 min-h-0">
                            <PropertiesPanel
                                cycle={currentCycle}
                                currentProcess={state.currentProcess}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThermodynamicsSimulator;