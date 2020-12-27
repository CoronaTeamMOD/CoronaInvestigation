import React from 'react';
import {Typography} from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import  {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';

import AddressGrid from '../AddressGrid/AddressGrid';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const OtherPublicLocationGrid: React.FC<Props> = (props: Props): JSX.Element => {
    const { interaction } = props;
    const {isBusiness} = getOptionsByPlaceAndSubplaceType(interaction.placeType, interaction.placeSubType);

    return (
        <>
            <FormInput xs={6} fieldName='שם המוסד'>
                <Typography variant='caption'>
                    {interaction.placeName}
                </Typography>
            </FormInput>
            <AddressGrid interaction={interaction}/>
            {
                !isBusiness && <BusinessContactGrid interaction={interaction}/>
            }
        </>
    );
};

export default OtherPublicLocationGrid;

interface Props {
    interaction: InteractionEventDialogData;
};
