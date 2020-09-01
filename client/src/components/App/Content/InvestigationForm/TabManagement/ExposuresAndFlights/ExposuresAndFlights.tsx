import React from 'react';
import {Divider, Typography} from "@material-ui/core";
import Toggle from "commons/Toggle/Toggle";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import FlightsForm from "./FlightsForm/FlightsForm";
import ExposureForm from "./ExposureForm/ExposureForm";
import useFormStyles from 'styles/formStyles';

export interface Country {
    id: string | "";
    name: string | "";
}

export interface City {
    id: string | "";
    name: string | "";
    country: Country;
}

export interface Airport {
    name: string | "";
    city: City;
}

const ExposuresAndFlights = () => {
    const [verifiedExposure, setHadVerifiedExposure] = React.useState<boolean>(true);
    const [hasBeenAbroad, setHasBeenAbroad] = React.useState<boolean>(true);

    const {fieldName, rowDiv} = useFormStyles();

    // TODO move styles to classes
    return (
        <>
            <div style={{width: '75vw', padding: '3vh 3vw 3vh 0'}}>
                <Typography variant='caption' className={fieldName}>
                    חשיפה אפשרית
                </Typography>

                <FormRowWithInput fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                    <Toggle/>
                </FormRowWithInput>

                {
                    verifiedExposure &&
                    <ExposureForm/>
                }
            </div>

            <Divider />

            <div style={{width: '75vw', padding: '3vh 3vw 3vh 0'}}>
                <Typography variant='caption' className={fieldName}>
                    חזרה מחו״ל
                </Typography>

                <FormRowWithInput fieldName='האם חזר מחו״ל?'>
                    <Toggle/>
                </FormRowWithInput>

                {
                    hasBeenAbroad &&
                    <FlightsForm/>
                }
            </div>
        </>
    );
};

export default ExposuresAndFlights;