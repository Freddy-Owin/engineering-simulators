import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Gear } from '../../types/gear.types';

interface ControlsPanelProps {
    gears: Gear[];
    isRunning: boolean;
    speed: number;
    onAddGear: (teeth: number) => void;
    onSpeedChange: (speed: number) => void;
    onToggle: () => void;
    onRemoveGear: (id: string) => void;
    onUpdateGear: (id: string, teeth: number) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
    gears,
    isRunning,
    speed,
    onAddGear,
    onSpeedChange,
    onToggle,
    onRemoveGear,
    onUpdateGear
}) => {
    const [newTeeth, setNewTeeth] = useState(20);

    const handleAddGear = () => {
        if (newTeeth >= 8 && newTeeth <= 100) {
            onAddGear(newTeeth);
            setNewTeeth(20);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Gear Controls</h2>

            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600">
                <h3 className="text-md font-semibold text-white mb-3">Simulation</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Speed: <span className="text-blue-400">{speed}x</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={speed}
                            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-custom"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0.1x</span>
                            <span>5x</span>
                        </div>
                    </div>

                    <button
                        onClick={onToggle}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${isRunning
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                            }`}
                    >
                        {isRunning ? 'Stop Simulation' : 'Start Simulation'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600">
                <h3 className="text-md font-semibold text-white mb-3">Add New Gear</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Teeth: <span className="text-purple-400">{newTeeth}</span>
                        </label>
                        <input
                            type="range"
                            min="8"
                            max="100"
                            value={newTeeth}
                            onChange={(e) => setNewTeeth(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-custom"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>8</span>
                            <span>100</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddGear}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                        Add Gear ({newTeeth} teeth)
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600">
                <h3 className="text-md font-semibold text-white mb-3">
                    Existing Gears <span className="text-gray-400 text-sm">({gears.length})</span>
                </h3>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {gears.map((gear, index) => (
                        <motion.div
                            key={gear.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/50"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow"
                                    style={{ backgroundColor: gear.color }}
                                />
                                <div>
                                    <div className="font-medium text-white text-sm">{gear.name}</div>
                                    <div className="text-xs text-gray-400">{gear.teeth} teeth</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    min="8"
                                    max="100"
                                    value={gear.teeth}
                                    onChange={(e) => onUpdateGear(gear.id, parseInt(e.target.value) || 8)}
                                    className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                                />
                                <button
                                    onClick={() => onRemoveGear(gear.id)}
                                    disabled={gears.length <= 2}
                                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-sm transition-colors"
                                    title={gears.length <= 2 ? "Need at least 2 gears" : "Remove gear"}
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-gray-600">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-xs text-gray-400">Total Gears</div>
                        <div className="text-blue-400 font-bold text-sm">{gears.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Gear Pairs</div>
                        <div className="text-green-400 font-bold text-sm">{Math.max(0, gears.length - 1)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Status</div>
                        <div className={`text-xs font-bold ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
                            {isRunning ? 'Running' : 'Paused'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlsPanel;