
import BorderCheckpointData from "./BorderCheckpointData";
import FlightData from "./FlightData";

export interface Flight {
    id: number | null;
    flightData: FlightData;
}
export interface BorderCheckpoint {
    id: number | null;
    borderCheckpointData: BorderCheckpointData;
}

interface ExposureAndFlightData {
    investigationId: number;
    flights: Flight[];
    borderCheckpoint: BorderCheckpoint | null;
}
export default ExposureAndFlightData;