import IdentificationType from 'models/IdentificationType';

export const SET_IDENTIFICATION_TYPES = 'SET_IDENTIFICATION_TYPES';

interface SetIdentificationTypes {
    type: typeof SET_IDENTIFICATION_TYPES,
    payload: { identificationTypes: IdentificationType[] }
};

export type identificationTypesAction = SetIdentificationTypes;