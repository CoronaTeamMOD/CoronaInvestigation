interface FlightData {
   wasAbroad: boolean;
   flightDestinationCountry: string | null;
   flightDestinationCity: string | null;
   flightDestinationAirport: string | null;
   flightOriginCountry: string | null;
   flightOriginCity: string | null;
   flightOriginAirport: string | null;
   flightStartDate: Date | null;
   flightEndDate: Date | null;
   airline: string | null;
   flightNum: string | null;
}

export default FlightData;
