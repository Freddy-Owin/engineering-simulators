import React, { useMemo } from 'react';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import type { ThermodynamicCycle } from '../../types/thermodynamics.types';

interface TSDiagramProps {
    cycle: ThermodynamicCycle;
    currentProcess: number;
}

const TSDiagram: React.FC<TSDiagramProps> = ({ cycle, currentProcess }) => {
    const chartData = useMemo(() => {
        const data: any[] = [];

        cycle.processes.forEach((process, processIndex) => {
            const segments = 50;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                let temperature, entropy;

                const entropyChange = process.heat / (process.startState.temperature + 273);
                entropy = processIndex * 1 + t * entropyChange;

                switch (process.type) {
                    case 'isothermal':
                        temperature = process.startState.temperature;
                        break;
                    case 'adiabatic':
                        entropy = processIndex * 1;
                        temperature = process.startState.temperature +
                            (process.endState.temperature - process.startState.temperature) * t;
                        break;
                    default:
                        temperature = process.startState.temperature +
                            (process.endState.temperature - process.startState.temperature) * t;
                }

                data.push({
                    entropy,
                    temperature: temperature + 273,
                    process: processIndex,
                });
            }
        });

        return data;
    }, [cycle, currentProcess]);

    const processColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="w-full h-full bg-gray-900 rounded">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="entropy"
                        label={{ value: 'Entropy (kJ/kg·K)', position: 'insideBottom', offset: -5 }}
                        stroke="#9ca3af"
                    />
                    <YAxis
                        label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }}
                        stroke="#9ca3af"
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                        labelStyle={{ color: '#f3f4f6' }}
                    />

                    {cycle.processes.map((process, index) => (
                        <Line
                            key={process.id}
                            type="monotone"
                            dataKey="temperature"
                            data={chartData.filter(d => d.process === index)}
                            stroke={processColors[index]}
                            strokeWidth={3}
                            dot={false}
                            name={`Process ${process.id}`}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TSDiagram;