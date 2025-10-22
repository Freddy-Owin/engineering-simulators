import React from 'react';
import { motion } from 'framer-motion';
import type { GearPair } from '../../types/gear.types';

interface RatioDisplayProps {
    pairs: GearPair[];
}

const RatioDisplay: React.FC<RatioDisplayProps> = ({ pairs }) => {
    if (pairs.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Gear Ratios</h3>
                <p className="text-gray-500">Add at least 2 gears to see ratios</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Gear Ratios</h3>

            <div className="space-y-4">
                {pairs.map((pair, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="font-medium text-gray-700">Speed Ratio</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    1:{pair.ratio.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {pair.driver.teeth} : {pair.driven.teeth}
                                </div>
                            </div>

                            <div>
                                <div className="font-medium text-gray-700">Torque Ratio</div>
                                <div className="text-2xl font-bold text-green-600">
                                    1:{pair.torqueRatio.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {pair.driven.teeth} : {pair.driver.teeth}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium" style={{ color: pair.driver.color }}>
                                    {pair.driver.name}
                                </span>
                                <span className="font-medium" style={{ color: pair.driven.color }}>
                                    {pair.driven.name}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Driver</span>
                                <span>Driven</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {pairs.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-sm">
                        <div className="font-medium text-yellow-800">Summary</div>
                        <div className="text-yellow-700">
                            Total ratio: 1:{pairs.reduce((acc, pair) => acc * pair.ratio, 1).toFixed(2)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatioDisplay;