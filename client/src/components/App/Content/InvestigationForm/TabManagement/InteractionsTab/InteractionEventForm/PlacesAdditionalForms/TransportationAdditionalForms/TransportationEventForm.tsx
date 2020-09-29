import React from 'react';
import { Collapse } from '@material-ui/core';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import BusEventForm from './BusEventForm';
import TrainEventForm from './TrainEventForm';
import FlightEventForm from './FlightEventForm';
import OrganizedTransportEventForm from './OrganizedTransportEventForm';

const { bus, train, flight, organizedTransport } = placeTypesCodesHierarchy.transportation.subTypesCodes;

const TransportationEventForm : React.FC<Props> = ({ placeSubType }: Props) : JSX.Element => {

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

interface Props {
    placeSubType: number;
}

export default TransportationEventForm;