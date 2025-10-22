export class IdealGas {
    static calculatePressure(volume: number, temperature: number, R: number): number {
        return (R * temperature) / volume;
    }

    static calculateVolume(pressure: number, temperature: number, R: number): number {
        return (R * temperature) / pressure;
    }

    static calculateTemperature(pressure: number, volume: number, R: number): number {
        return (pressure * volume) / R;
    }

    static isentropicPressureVolume(
        P1: number, V1: number, V2: number, gamma: number
    ): number {
        return P1 * Math.pow(V1 / V2, gamma);
    }

    static isentropicTemperaturePressure(
        T1: number, P1: number, P2: number, gamma: number
    ): number {
        return T1 * Math.pow(P2 / P1, (gamma - 1) / gamma);
    }

    static isentropicTemperatureVolume(
        T1: number, V1: number, V2: number, gamma: number
    ): number {
        return T1 * Math.pow(V1 / V2, gamma - 1);
    }
}
