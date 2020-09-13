interface FlightData {
   wasAbroad: boolean,
   flightDestinationCountry: string;
   flightDestinationCity: string;
   flightDestinationAirport: string;
   flightOriginCountry: string;
   flightOriginCity: string;
   flightOriginAirport: string; 
   flightStartDate: Date | undefined;
   flightEndDate: Date | undefined;
   airline: string;
   flightNum: string;
}

export default FlightData;