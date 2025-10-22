import React from 'react';
import type { ThermodynamicCycle } from '../../types/thermodynamics.types';

interface PropertiesPanelProps {
    cycle: ThermodynamicCycle;
    currentProcess: number;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ cycle, currentProcess }) => {
    const processNames: Record<string, string> = {
        isothermal: 'Isothermal',
        adiabatic: 'Adiabatic',
        isobaric: 'Isobaric',
        isochoric: 'Isochoric',
        polytropic: 'Polytropic'
    };

    return (
        <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600 h-full flex flex-col">
            <h3 className="text-xs font-semibold text-white mb-2">Properties</h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <div className="space-y-1">
                    <div className="text-[10px] text-gray-400">Process Sequence</div>
                    {cycle.processes.map((process, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-1 rounded text-xs ${index === currentProcess
                                    ? 'bg-blue-500/20 border border-blue-500/30'
                                    : 'bg-gray-700/30'
                                }`}
                        >
                            <span className="text-gray-200">{process.id}</span>
                            <span className="text-gray-400">{processNames[process.type]}</span>
                            <span className={`font-mono ${process.work > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {process.work > 0 ? '+' : ''}{process.work.toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="text-[10px] text-gray-400 mb-1">State Summary</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                        {cycle.processes.slice(0, 2).map((process, index) => (
                            <div key={index} className="bg-gray-700/30 p-1 rounded border border-gray-600">
                                <div className="font-semibold text-gray-200 text-center text-[10px]">
                                    State {index + 1}
                                </div>
                                <div className="space-y-0.5 mt-0.5">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-[10px]">P:</span>
                                        <span className="text-blue-300 text-[10px]">{process.startState.pressure.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-[10px]">V:</span>
                                        <span className="text-green-300 text-[10px]">{process.startState.volume.toFixed(3)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-[10px]">T:</span>
                                        <span className="text-red-300 text-[10px]">{process.startState.temperature.toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPanel;