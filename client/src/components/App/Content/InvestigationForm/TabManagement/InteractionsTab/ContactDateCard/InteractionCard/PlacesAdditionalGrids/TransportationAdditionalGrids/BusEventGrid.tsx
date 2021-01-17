import React from 'react';
import { useSelector } from 'react-redux';
import {Grid, Typography} from '@material-ui/core';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionGridItem from '../InteractionGridItem';

const BusEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <Grid container justify='flex-start' alignItems='center'>
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='קו'
                    content={interaction.busLine}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='חברה'
                    content={interaction.busCompany}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='עיר מוצא'
                    content={cities.get(interaction.cityOrigin as string)?.displayName}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='עיר מוצא'
                    content={cities.get(interaction.cityOrigin as string)?.displayName}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='תחנת עליה'
                    content={interaction.boardingStation}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='עיר יעד'
                    content={cities.get(interaction.cityDestination as string)?.displayName}
                />
                <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='עיר מוצא'
                    content={interaction.endStation}
                />
            </Grid>
        </>
    );
};

export default BusEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}