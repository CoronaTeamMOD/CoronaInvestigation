import React from 'react';
import { useFormContext } from 'react-hook-form'

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm';

const MedicalLocationForm : React.FC = () : JSX.Element => {
    const { getValues } = useFormContext();
    const { placeSubType } = getValues();

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

export default MedicalLocationForm;