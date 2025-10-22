import React from 'react';
import type { SimulationParameters } from '../../types/thermodynamics.types';

interface CycleControlsProps {
    parameters: SimulationParameters;
    onParameterChange: (param: keyof SimulationParameters, value: number) => void;
}

const CycleControls: React.FC<CycleControlsProps> = ({
    parameters,
    onParameterChange,
}) => {
    const parameterConfigs = {
        compressionRatio: {
            label: 'Compression',
            min: 5,
            max: 15,
            step: 0.5,
            unit: '',
        },
        pressureRatio: {
            label: 'Pressure',
            min: 2,
            max: 20,
            step: 0.5,
            unit: '',
        },
        temperatureRatio: {
            label: 'Temperature',
            min: 2,
            max: 8,
            step: 0.1,
            unit: '',
        },
        isentropicEfficiency: {
            label: 'Efficiency',
            min: 0.5,
            max: 0.95,
            step: 0.01,
            unit: '',
        },
        massFlowRate: {
            label: 'Mass Flow',
            min: 0.1,
            max: 5,
            step: 0.1,
            unit: 'kg/s',
        }
    } as const;

    const parameterKeys: (keyof typeof parameterConfigs)[] = [
        'compressionRatio',
        'pressureRatio',
        'temperatureRatio',
        'isentropicEfficiency',
        'massFlowRate'
    ];

    return (
        <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-600 h-full flex flex-col">
            <h3 className="text-xs font-semibold text-white mb-2">Parameters</h3>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {parameterKeys.map((key) => {
                    const value = parameters[key];
                    const config = parameterConfigs[key];

                    return (
                        <div
                            key={key}
                            className="bg-gray-700/30 rounded p-2 border border-gray-600/50"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-200">
                                    {config.label}
                                </label>
                                <span className="text-blue-400 font-bold text-xs">
                                    {value.toFixed(key === 'isentropicEfficiency' ? 2 : 1)}{config.unit}
                                </span>
                            </div>

                            <input
                                type="range"
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={value}
                                onChange={(e) => onParameterChange(
                                    key,
                                    parseFloat(e.target.value)
                                )}
                                className="w-full h-1 bg-gray-600 rounded appearance-none cursor-pointer slider-compact"
                            />

                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>{config.min}</span>
                                <span>{config.max}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-600">
                <div className="grid grid-cols-2 gap-1">
                    {[
                        { label: 'High Eff.', compression: 8, pressure: 15, efficiency: 0.9 },
                        { label: 'Standard', compression: 6, pressure: 10, efficiency: 0.85 },
                        { label: 'Low Comp.', compression: 4, pressure: 6, efficiency: 0.75 },
                        { label: 'High Perf.', compression: 12, pressure: 18, efficiency: 0.88 }
                    ].map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => {
                                onParameterChange('compressionRatio', preset.compression);
                                onParameterChange('pressureRatio', preset.pressure);
                                onParameterChange('isentropicEfficiency', preset.efficiency);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-1 rounded text-[10px] transition-colors truncate"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CycleControls;