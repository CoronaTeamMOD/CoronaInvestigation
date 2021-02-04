import React from 'react';
import { Grid } from '@material-ui/core';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import  {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';

import AddressGrid from '../AddressGrid/AddressGrid';
import InteractionGridItem from './InteractionGridItem';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const OtherPublicLocationGrid: React.FC<Props> = (props: Props): JSX.Element => {
    const { interaction } = props;
    const { isBusiness } = getOptionsByPlaceAndSubplaceType(interaction.placeType, interaction.placeSubType);

    return (
        <>
            <InteractionGridItem 
                containerSize={6}
                labelLengthMD={3}
                labelLengthLG={2}
                title='שם המוסד'
                content={interaction.placeName}
            />
            <Grid xs={6} />
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
