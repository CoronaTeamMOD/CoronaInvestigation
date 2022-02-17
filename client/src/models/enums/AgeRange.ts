import { AgeRange } from "models/AgeRange";
import KeyValuePair from "models/KeyValuePair";

const ageRange: AgeRange[] = [
    {
        id: 1,
        displayName: 'גיל',
        ageFrom: null,
        ageTo: null
    },
    {
        id: 2,
        displayName: 'הכל',
        ageFrom: null,
        ageTo: null
    },
    {
        id: 3,
        displayName: 'טווח גילאים',
        ageFrom: 1,
        ageTo: 150
    },
    {
        id: 4,
        displayName: 'ללא גיל',
        ageFrom: null,
        ageTo: null
    }
];

export enum AgeRangeCodes {
    AGE = 1,
    ALL = 2,
    RANGE = 3,
    NO_AGE = 4
};

export const defaultAgeRange: AgeRange = ageRange[0];

export default ageRange;