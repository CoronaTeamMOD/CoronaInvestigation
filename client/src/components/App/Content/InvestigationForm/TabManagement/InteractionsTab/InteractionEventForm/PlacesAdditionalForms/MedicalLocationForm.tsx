import React from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm/DefaultPlaceEventForm';

const MedicalLocationForm : React.FC<Props> = ({ placeSubType }: Props) : JSX.Element => {

    return (
        <>
        {
            placeSubType === placeTypesCodesHierarchy.medical.subTypesCodes.hospital ?
                <HospitalEventForm />
            : 
                <DefaultPlaceEventForm />
        }
        </>
    );
};

interface Props {
    placeSubType: number;
}

export default MedicalLocationForm;