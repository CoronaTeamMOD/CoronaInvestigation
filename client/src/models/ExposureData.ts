import PlaceType from "./PlaceType";

interface ExposureData {
    placeType: PlaceType;
    exposureLocation: string; // To be changed once google api is integrated
    exposingPersonFirstName: string;
    exposingPersonLastName: string;
    exposureDate: Date;
}

export default ExposureData;