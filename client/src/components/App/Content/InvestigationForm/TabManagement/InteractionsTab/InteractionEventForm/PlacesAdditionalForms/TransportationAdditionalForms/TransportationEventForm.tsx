import React, { useContext } from 'react';
import { Collapse } from '@material-ui/core';

import BusEventForm from './BusEventForm';
import TrainEventForm from './TrainEventForm';
import FlightEventForm from './FlightEventForm';
import OrganizedTransportEventForm from './OrganizedTransportEventForm';
import { InteractionEventDialogContext } from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const busPlaceType = 'אוטובוס';
const trainPlaceType = 'רכבת';
const flightPlaceType = 'טיסה';
const organizedTransportPlaceType = 'הסעות';

const TransportationEventForm : React.FC = () : JSX.Element => {

    const { placeSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
            {
                placeSubType === busPlaceType &&
                <Collapse in={placeSubType === busPlaceType}>
                    <BusEventForm/>
                </Collapse>
            }
            {
                placeSubType === trainPlaceType &&
                <Collapse in={placeSubType === trainPlaceType}>
                    <TrainEventForm/>                        
                </Collapse>
            }
            {
                placeSubType === flightPlaceType &&
                <Collapse in={placeSubType === flightPlaceType}>
                    <FlightEventForm/>                    
                </Collapse>
            }
            {
                placeSubType === organizedTransportPlaceType &&
                <Collapse in={placeSubType === organizedTransportPlaceType}>
                    <OrganizedTransportEventForm/>
                </Collapse>
            }
        </>
    );
};

export default TransportationEventForm;