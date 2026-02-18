export interface TelemetryData {
    timestamp: number;
    moisturePercent: number;
    dryingRate: number;
    rawValue: number;
    nodeVersion: number;
}

const API_URL = 'https://fftpg1osyj.execute-api.us-east-1.amazonaws.com/prod/history?deviceId=00:70:07:82:B3:80';

export const fetchTelemetry = async (): Promise<TelemetryData[]> => {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            console.error('Failed to fetch telemetry:', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        // API returns data sorted ascending (oldest first). 
        // We sort it descending (newest first) to ensure data[0] is the latest.
        // This also aligns with the HistoryChart expectation (which reverses it back to ascending).
        return data.sort((a: TelemetryData, b: TelemetryData) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Error fetching telemetry:', error);
        return [];
    }
};
