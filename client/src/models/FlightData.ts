interface FlightData {
   destinationCountry: string;
   destinationCity: string;
   destinationAirport: string;
   originCountry: string;
   originCity: string;
   originAirport: string; 
   flightStartDate: Date | undefined;
   flightEndDate: Date | undefined;
   airline: string;
   flightNumber: string;
}

export default FlightData;