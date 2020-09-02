import React from 'react';
import { Select, MenuItem, Collapse } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';

import useStyles from '../../NewInteractionEventDialogStyles';
import BusEventForm from './TransportationAdditionalForms/BusEventForm';
import TrainEventForm from './TransportationAdditionalForms/TrainEventForm';
import FlightEventForm from './TransportationAdditionalForms/FlightEventForm';
import OrganizedTransportationEventForm from './TransportationAdditionalForms/OrganizedTransportationEventForm';

const transportation = [
    'אוטובוס',
    'רכבת',
    'מונית',
    'טיסה',
    'הסעות',
    'רכב פרטי'
]

const TransportationEventForm : React.FC = () : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [transportationType, setTransportationType] = React.useState<string>(transportation[0]);

    const onTransportationTypeChange = (event: React.ChangeEvent<any>) => setTransportationType(event.target.value);
    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='סוג תחבורה'>
                    <Select
                        value={transportationType}
                        onChange={onTransportationTypeChange}
                        className={classes.formSelect}
                    >
                    {
                        transportation.map((transpotOption: string) => (
                            <MenuItem key={transpotOption} value={transpotOption}>{transpotOption}</MenuItem>
                        ))
                    }
                    </Select>
                </FormInput>
            </div>
            <Collapse in={transportationType === 'אוטובוס'}>
                <BusEventForm/>
            </Collapse>
            <Collapse in={transportationType === 'רכבת'}>
                <TrainEventForm/>                        
            </Collapse>
            <Collapse in={transportationType === 'טיסה'}>
                <FlightEventForm/>                    
            </Collapse>
            <Collapse in={transportationType === 'הסעות'}>
                <OrganizedTransportationEventForm/>
            </Collapse>
        </>
    );
};

export default TransportationEventForm;