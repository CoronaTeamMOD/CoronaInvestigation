import PlaceType from "./PlaceType";

interface ExposureData {
    firstName: string;
    lastName: string;
    date: Date | undefined;
    address: string; // To be changed once google api is integrated
    placeType: PlaceType;
}

export default ExposureData;