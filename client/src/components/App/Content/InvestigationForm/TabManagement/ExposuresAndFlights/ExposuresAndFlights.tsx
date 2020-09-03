import React from 'react';
import {Collapse, Divider, Typography} from '@material-ui/core';
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import FlightsForm from './FlightsForm/FlightsForm';
import ExposureForm from './ExposureForm/ExposureForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ExposuresAndFlightsStyles';


const ExposuresAndFlights = () => {
    const [verifiedExposure, setHadVerifiedExposure] = React.useState<boolean>(true);
    const [hasBeenAbroad, setHasBeenAbroad] = React.useState<boolean>(true);

    const {fieldName} = useFormStyles();
    const classes = useStyles();

    const handleVerifiedExposureToggle = (event: React.MouseEvent<HTMLElement>, value: any) => setHadVerifiedExposure(value);
    const handleHasBeenAbroad = (event: React.MouseEvent<HTMLElement>, value: any) => setHasBeenAbroad(value);
    return (
        <>
            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חשיפה אפשרית
                </Typography>

                <FormRowWithInput fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                    <Toggle value={verifiedExposure} onChange={handleVerifiedExposureToggle}/>
                </FormRowWithInput>

                <Collapse in={verifiedExposure} className={classes.additionalInformationForm}>
                    <ExposureForm/>
                </Collapse>
            </div>

            <Divider/>

            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חזרה מחו״ל
                </Typography>

                <FormRowWithInput fieldName='האם חזר מחו״ל?'>
                    <Toggle value={hasBeenAbroad} onChange={handleHasBeenAbroad}/>
                </FormRowWithInput>

                <Collapse in={hasBeenAbroad} className={classes.additionalInformationForm}>
                    <FlightsForm/>
                </Collapse>
            </div>
        </>
    );
};

export default ExposuresAndFlights;