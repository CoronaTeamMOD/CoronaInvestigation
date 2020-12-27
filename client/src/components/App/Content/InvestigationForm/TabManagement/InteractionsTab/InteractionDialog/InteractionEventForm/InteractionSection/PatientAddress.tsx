import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, TextField } from '@material-ui/core';

import DBAddress from 'models/DBAddress';
import StoreStateType from 'redux/storeStateType';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import City from 'models/City';

const ADDRESS_LABEL = 'כתובת';
const CITY_LABEL = 'עיר';
const STREET_LABEL = 'רחוב';
const FLOOR_LABEL = 'קומה';
const HOUSE_NUM_LABEL = 'מספר בית';
const UNKNOWN = 'לא ידוע';

const PatientAddress: React.FC<PatientAddressProps> = (): JSX.Element => {

    const patientAddress = useSelector<StoreStateType, DBAddress>(state => state.address);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { city, floor, houseNum, streetName: street } = patientAddress;

    return (
        <FormRowWithInput labelLength={2} fieldName={ADDRESS_LABEL}>
            <>
                <Grid item xs={2}>
                    <TextField
                        disabled 
                        value={cities.get(city)?.displayName || UNKNOWN}
                        label={CITY_LABEL}
                    />
                </Grid> 
                <Grid item xs={2}>
                    <TextField
                        disabled 
                        value={street || UNKNOWN}
                        label={STREET_LABEL}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        disabled
                        value={floor || UNKNOWN}
                        label={FLOOR_LABEL}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        disabled
                        value={houseNum || UNKNOWN}
                        label={HOUSE_NUM_LABEL}
                    />
                </Grid>
            </>
        </FormRowWithInput>
    )
}
            
export default PatientAddress;

export interface PatientAddressProps {
    city?: string;
    street?: string;
    floor?: number;
    houseNumber?: number;
};
