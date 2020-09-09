import React, { useContext } from 'react';
import { Collapse } from '@material-ui/core';

import BusEventForm from './BusEventForm';
import TrainEventForm from './TrainEventForm';
import FlightEventForm from './FlightEventForm';
import OrganizedTransportEventForm from './OrganizedTransportEventForm';
import { InteractionEventDialogContext } from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const busLocationType = 1;
const trainLocationType = 85;
const flightLocationType = 38;
const organizedTransportLocationType = 31;

export const resetTransportationFormFields = {
    boardingCity: undefined,
    boardingCountry: undefined,
    boardingStation: undefined,
    endCity: undefined,
    endCountry: undefined,
    endStation: undefined,
    airline: undefined,
    trainLine: undefined,
    buisnessContactName: undefined,
    buisnessContactNumber: undefined,
    busCompany: undefined,
    busLine: undefined,
    flightNumber: undefined
}

export const TransportationEventForm : React.FC = () : JSX.Element => {

    const { locationSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
            {
                locationSubType === busLocationType &&
                <Collapse in={locationSubType === busLocationType}>
                    <BusEventForm/>
                </Collapse>
            }
            {
                locationSubType === trainLocationType &&
                <Collapse in={locationSubType === trainLocationType}>
                    <TrainEventForm/>                        
                </Collapse>
            }
            {
                locationSubType === flightLocationType &&
                <Collapse in={locationSubType === flightLocationType}>
                    <FlightEventForm/>                    
                </Collapse>
            }
            {
                locationSubType === organizedTransportLocationType &&
                <Collapse in={locationSubType === organizedTransportLocationType}>
                    <OrganizedTransportEventForm/>
                </Collapse>
            }
        </>
    );
};