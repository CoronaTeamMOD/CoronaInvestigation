import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Country from 'models/Country';
import StoreStateType from 'redux/storeStateType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionGridItem from '../InteractionGridItem';

const FlightEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;

    const countries : Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

    return (
        <>
            <Grid container justify='flex-start' alignItems='center' spacing={1}>
                <InteractionGridItem 
                        containerSize={6}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='מספר טיסה'
                        content={interaction.flightNum}
                />
                <InteractionGridItem 
                        containerSize={6}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='חברת תעופה'
                        content={interaction.airline}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='ארץ מוצא'
                        content={interaction.flightOriginCountry}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='עיר מוצא'
                        content={interaction.flightOriginCity}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='שדה תעופה מוצא'
                        content={interaction.flightOriginAirport}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='ארץ יעד'
                        content={countries.get(interaction.flightDestinationCountry as string)?.displayName}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={2}
                        title='עיר יעד'
                        content={interaction.flightDestinationCity}
                />
                <InteractionGridItem 
                        containerSize={4}
                        labelLengthMD={4}
                        labelLengthLG={3}
                        title='שדה תעופה יעד'
                        content={interaction.flightDestinationAirport}
                />
                <InteractionGridItem 
                        containerSize={12}
                        labelLengthMD={4}
                        labelLengthLG={3}
                        title='מושבים הצריכים להכנס לבידוד - מיועד להחצנה'
                        content={interaction.placeDescription}
                />
            </Grid>
        </>
    );
};

export default FlightEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
