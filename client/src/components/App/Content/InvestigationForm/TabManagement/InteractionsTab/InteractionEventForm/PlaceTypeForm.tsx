import React from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import MedicalLocationForm from './PlacesAdditionalForms/MedicalLocationForm';
import OtherPublicLocationForm from './PlacesAdditionalForms/OtherPublicLocationForm';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm/DefaultPlaceEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';

const PlaceTypeForm: React.FC<Props> = ({ placeType, placeSubType, grade }: Props): JSX.Element => {
    const {
        geriatric,
        school,
        medical,
        office,
        otherPublicPlaces,
        privateHouse,
        religion,
        transportation,
    } = placeTypesCodesHierarchy;

    switch (placeType) {
        case privateHouse.code: {
            return (
                <PrivateHouseEventForm />
            )
        }
        case office.code: {
            return (
                <OfficeEventForm />
            )
        }
        case transportation.code: {
            return (
                <TransportationEventForm placeSubType={placeSubType} />
            )
        }
        case school.code: {
            return (
                <SchoolEventForm grade={grade} placeSubType={placeSubType} />
            )
        }
        case medical.code: {
            return (
                <MedicalLocationForm placeSubType={placeSubType} />
            )
        }
        case religion.code || geriatric.code: {
            return (
                <DefaultPlaceEventForm />
            )
        }
        case otherPublicPlaces.code: {
            return (
                <OtherPublicLocationForm placeSubType={placeSubType} />
            )
        }
        default: {
            return (
                <DefaultPlaceEventForm />
            )
        }
    }
}

export default PlaceTypeForm;

interface Props {
    placeType: string;
    placeSubType: number;
    grade: string;
}
