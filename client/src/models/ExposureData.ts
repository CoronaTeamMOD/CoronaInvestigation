import PlaceType from "./PlaceType";

interface ExposureData {
    placeType: PlaceType;
    exposureLocation: string; // To be changed once google api is integrated
    exposingPersonName: string;
}

export default ExposureData;