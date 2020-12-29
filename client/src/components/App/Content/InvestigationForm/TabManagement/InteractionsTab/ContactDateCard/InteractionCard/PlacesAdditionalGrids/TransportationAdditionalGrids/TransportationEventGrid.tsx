import React from 'react';

import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import BusEventGrid from './BusEventGrid';
import TrainEventGrid from './TrainEventGrid';
import FlightEventGrid from './FlightEventGrid';
import OrganizedTransportEventGrid from './OrganizedTransportEventGrid';

// @ts-ignore
const { bus, train, flight, organizedTransport } = placeTypesCodesHierarchy.transportation.subTypesCodes;

const TransportationEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <>
            {
                interaction.placeSubType === bus.code &&
                <BusEventGrid interaction={interaction}/>
            }
            {
                interaction.placeSubType === train.code &&
                <TrainEventGrid interaction={interaction}/>                        
            }
            {
                interaction.placeSubType === flight.code &&
                <FlightEventGrid interaction={interaction}/>                    
            }
            {
                interaction.placeSubType === organizedTransport.code &&
                <OrganizedTransportEventGrid  interaction={interaction}/>
            }
        </>
    );
};

export default TransportationEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}