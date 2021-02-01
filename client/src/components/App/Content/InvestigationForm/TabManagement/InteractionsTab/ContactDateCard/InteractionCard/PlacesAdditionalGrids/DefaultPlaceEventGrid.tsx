import React from 'react';
import { Grid } from '@material-ui/core';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import InteractionGridItem from './InteractionGridItem';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const DefaultPlaceEventGrid: React.FC<Props> = (props: Props): JSX.Element => {

    const { interaction } = props;

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
            <AddressGrid interaction={interaction} />
            <BusinessContactGrid interaction={interaction} />
        </>
    );
};

export default DefaultPlaceEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
