import React from 'react';
import { Grid } from '@material-ui/core';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import InteractionGridItem from './InteractionGridItem';

const OfficeEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;

    return (
        <>
            <Grid container justify='flex-start' alignItems='center'>
                <InteractionGridItem 
                    containerSize={12}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='שם המשרד'
                    content={interaction.placeName}
                />
            </Grid>
            <AddressGrid interaction={interaction}/>
        </>
    );
};

export default OfficeEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}