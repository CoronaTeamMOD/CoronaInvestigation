import React from 'react';
import { Grid } from '@material-ui/core';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import InteractionGridItem from './InteractionGridItem';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const SchoolEventGrid: React.FC<Props> = (props: Props): JSX.Element => {
    const { interaction } = props;

    return (
        <>
            <Grid container justify='flex-start' alignItems='center'>
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='שם המוסד'
                    content={interaction.placeName}
                />
                    {
                        interaction.grade &&
                        <InteractionGridItem 
                            containerSize={6}
                            labelLengthMD={3}
                            labelLengthLG={2}
                            title='כיתה'
                            content={interaction.grade}
                        />
                    }
            </Grid>
            <AddressGrid interaction={interaction} />
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default SchoolEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
};
