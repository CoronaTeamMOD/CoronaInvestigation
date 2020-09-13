interface FlightData {
   wasAbroad: boolean,
   flightDestinationCountry: string | null;
   flightDestinationCity: string;
   flightDestinationAirport: string;
   flightOriginCountry: string | null;
   flightOriginCity: string;
   flightOriginAirport: string; 
   flightStartDate: Date | undefined;
   flightEndDate: Date | undefined;
   airline: string;
   flightNum: string;
}

export default FlightData;