import React, { useContext } from 'react';
import { Collapse } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import BusEventForm from './BusEventForm';
import TrainEventForm from './TrainEventForm';
import FlightEventForm from './FlightEventForm';
import OrganizedTransportEventForm from './OrganizedTransportEventForm';
import { InteractionEventDialogContext } from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const busLocationType = 'אוטובוס';
const trainLocationType = 'רכבת';
const taxiLocationType = 'מונית';
const flightLocationType = 'טיסה';
const organizedTransportLocationType = 'הסעות';
const privateCarLocationType = 'רכב פרטי';

export const transportationTypes = [
    busLocationType,
    trainLocationType,
    taxiLocationType,
    flightLocationType,
    organizedTransportLocationType,
    privateCarLocationType
]

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

const TransportationEventForm : React.FC = () : JSX.Element => {

    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { locationSubType } = interactionEventDialogData;

    const formClasses = useFormStyles();

    React.useEffect(()=> {
        if (!locationSubType || !transportationTypes.includes(locationSubType))
            setInteractionEventDialogData(
                {...interactionEventDialogData as InteractionEventDialogData, locationSubType: transportationTypes[0]});
    }, [])

    const onTransportationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) =>
        setInteractionEventDialogData(
            {...interactionEventDialogData as InteractionEventDialogData, 
                locationSubType: event.target.value as string,
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
            });

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='סוג תחבורה'>
                    <CircleSelect
                        value={locationSubType}
                        onChange={onTransportationTypeChange}
                        className={formClasses.formSelect}
                        options={transportationTypes}
                    />
                </FormInput>
            </div>
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

export default TransportationEventForm;