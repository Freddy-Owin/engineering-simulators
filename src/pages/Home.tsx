// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/app-logo.png';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-8">
            <div className="text-center">
                <div className="mb-8 flex flex-col items-center">
                    <img
                        src={logo}
                        alt="First ICT"
                        className="h-72 w-auto mb-4"
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Physics Simulators
                    </h1>
                </div>

                <p className="mx-auto text-xl text-gray-300 mb-12 max-w-2xl">
                    Interactive educational simulations for understanding mechanical and thermodynamic principles
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Link
                        to="/gear-ratio-simulator"
                        className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-blue-500"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Gear Ratio Simulator</h3>
                            <p className="text-gray-300 text-sm">
                                Explore mechanical advantage, torque, and speed relationships in interactive 3D gear systems
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/thermodynamics"
                        className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-red-500"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors">
                                <span className="text-2xl">🔥</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Thermodynamics Visualizer</h3>
                            <p className="text-gray-300 text-sm">
                                Visualize PV and TS diagrams for Carnot, Otto, Diesel cycles with real-time calculations
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="mt-12 text-gray-400 text-sm">
                    <p>Built with React, TypeScript, Three.js, and TailwindCSS</p>
                </div>
            </div>
        </div>
    );
};

export default Home;