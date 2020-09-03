import React from 'react';
import { Collapse } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';

import useStyles from '../../NewInteractionEventDialogStyles';
import BusEventForm from './TransportationAdditionalForms/BusEventForm';
import TrainEventForm from './TransportationAdditionalForms/TrainEventForm';
import FlightEventForm from './TransportationAdditionalForms/FlightEventForm';
import OrganizedTransportationEventForm from './TransportationAdditionalForms/OrganizedTransportationEventForm';

const transportationTypes = [
    'אוטובוס',
    'רכבת',
    'מונית',
    'טיסה',
    'הסעות',
    'רכב פרטי'
]

interface Props {
    onSubTypeChange: () => void;
}

const TransportationEventForm : React.FC<Props> = (props: Props) : JSX.Element => {
    const { onSubTypeChange } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [transportationType, setTransportationType] = React.useState<string>('0');

    React.useEffect(() => {
        onSubTypeChange();
    }, [transportationType]);

    const onTransportationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => setTransportationType(event.target.value as string);
    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='סוג תחבורה'>
                    <CircleSelect
                        value={transportationType}
                        onChange={onTransportationTypeChange}
                        className={classes.formSelect}
                        options={transportationTypes}
                    />
                </FormInput>
            </div>
            <Collapse in={transportationTypes[+transportationType] === 'אוטובוס'}>
                <BusEventForm/>
            </Collapse>
            <Collapse in={transportationTypes[+transportationType] === 'רכבת'}>
                <TrainEventForm/>                        
            </Collapse>
            <Collapse in={transportationTypes[+transportationType] === 'טיסה'}>
                <FlightEventForm/>                    
            </Collapse>
            <Collapse in={transportationTypes[+transportationType] === 'הסעות'}>
                <OrganizedTransportationEventForm/>
            </Collapse>
        </>
    );
};

export default TransportationEventForm;