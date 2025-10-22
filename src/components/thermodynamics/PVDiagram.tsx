import React, { useMemo } from 'react';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import type { ThermodynamicCycle } from '../../types/thermodynamics.types';

interface PVDiagramProps {
    cycle: ThermodynamicCycle;
    currentProcess: number;
}

const PVDiagram: React.FC<PVDiagramProps> = ({ cycle, currentProcess }) => {
    const chartData = useMemo(() => {
        const data: any[] = [];

        cycle.processes.forEach((process, processIndex) => {
            const segments = 50;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                let pressure, volume;

                switch (process.type) {
                    case 'isothermal':
                        volume = process.startState.volume +
                            (process.endState.volume - process.startState.volume) * t;
                        pressure = (process.startState.pressure * process.startState.volume) / volume;
                        break;

                    case 'adiabatic':
                        volume = process.startState.volume +
                            (process.endState.volume - process.startState.volume) * t;
                        pressure = process.startState.pressure *
                            Math.pow(process.startState.volume / volume, 1.4);
                        break;

                    case 'isobaric':
                        volume = process.startState.volume +
                            (process.endState.volume - process.startState.volume) * t;
                        pressure = process.startState.pressure;
                        break;

                    case 'isochoric':
                        volume = process.startState.volume;
                        pressure = process.startState.pressure +
                            (process.endState.pressure - process.startState.pressure) * t;
                        break;

                    default:
                        volume = process.startState.volume +
                            (process.endState.volume - process.startState.volume) * t;
                        pressure = process.startState.pressure +
                            (process.endState.pressure - process.startState.pressure) * t;
                }

                data.push({
                    volume,
                    pressure,
                    process: processIndex,
                    isCurrent: processIndex === currentProcess && i === segments
                });
            }
        });

        return data;
    }, [cycle, currentProcess]);

    const processColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="w-full h-full bg-gray-900 rounded">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="volume"
                        label={{ value: 'Volume (m³)', position: 'insideBottom', offset: -5 }}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <YAxis
                        label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                        labelStyle={{ color: '#f3f4f6' }}
                    />

                    {cycle.processes.map((process, index) => (
                        <Line
                            key={process.id}
                            type="monotone"
                            dataKey="pressure"
                            data={chartData.filter(d => d.process === index)}
                            stroke={processColors[index]}
                            strokeWidth={2}
                            dot={false}
                            name={`Process ${process.id}`}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PVDiagram;