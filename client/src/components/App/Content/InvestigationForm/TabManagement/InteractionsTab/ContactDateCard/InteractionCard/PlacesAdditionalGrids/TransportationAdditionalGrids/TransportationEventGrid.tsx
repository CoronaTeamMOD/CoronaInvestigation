import React from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import BusEventGrid from './BusEventGrid';
import TrainEventGrid from './TrainEventGrid';
import FlightEventGrid from './FlightEventGrid';
import OrganizedTransportEventGrid from './OrganizedTransportEventGrid';

const { bus, train, flight, organizedTransport } = placeTypesCodesHierarchy.transportation.subTypesCodes;

const TransportationEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <>
            {
                interaction.placeSubType === bus &&
                <BusEventGrid interaction={interaction}/>
            }
            {
                interaction.placeSubType === train &&
                <TrainEventGrid interaction={interaction}/>                        
            }
            {
                interaction.placeSubType === flight &&
                <FlightEventGrid interaction={interaction}/>                    
            }
            {
                interaction.placeSubType === organizedTransport &&
                <OrganizedTransportEventGrid  interaction={interaction}/>
            }
        </>
    );
};

export default TransportationEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}