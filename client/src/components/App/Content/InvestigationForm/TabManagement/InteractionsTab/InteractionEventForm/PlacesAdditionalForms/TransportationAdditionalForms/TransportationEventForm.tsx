import React, { useContext } from 'react';
import { Collapse } from '@material-ui/core';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import BusEventForm from './BusEventForm';
import TrainEventForm from './TrainEventForm';
import FlightEventForm from './FlightEventForm';
import OrganizedTransportEventForm from './OrganizedTransportEventForm';
import { InteractionEventDialogContext } from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const { bus, train, flight, organizedTransport } = placeTypesCodesHierarchy.transportation.subTypesCodes;

const TransportationEventForm : React.FC = () : JSX.Element => {

    const { placeSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
            {
                placeSubType === bus &&
                <Collapse in={placeSubType === bus}>
                    <BusEventForm/>
                </Collapse>
            }
            {
                placeSubType === train &&
                <Collapse in={placeSubType === train}>
                    <TrainEventForm/>                        
                </Collapse>
            }
            {
                placeSubType === flight &&
                <Collapse in={placeSubType === flight}>
                    <FlightEventForm/>                    
                </Collapse>
            }
            {
                placeSubType === organizedTransport &&
                <Collapse in={placeSubType === organizedTransport}>
                    <OrganizedTransportEventForm/>
                </Collapse>
            }
        </>
    );
};

export default TransportationEventForm;