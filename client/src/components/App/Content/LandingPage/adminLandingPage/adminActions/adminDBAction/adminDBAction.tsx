import React from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, TextField } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import FieldName from 'commons/FieldName/FieldName';

import useAdminDBAction from './useAdminDBAction';
import UpdateButton from '../../UpdateButton/UpdateButton';

const addText = 'הוספה';
const flightCompanyFieldName = 'בחר חברת תעופה';
const newFlightCompanyFieldName = 'חברת תעופה:';
const newFlightNumberFieldName = 'מספר טיסה:';

const AdminDBAction = (): JSX.Element => {
 
	const airlines = useSelector<StoreStateType, Map<number, string>>(state => state.airlines);
	const formattedAirlines = Array.from(airlines).map(airline => {return {id: airline[0] , displayName : airline[1]}})
    
    const {
        flightCompany, setFlightCompany,
        newFlightCompany, setNewFlightCompany,
        newFlightNumber, setNewFlightNumber,
        saveNewFlightNumber, saveNewFlightCompany
    } = useAdminDBAction({});

    return (
        <Grid container xs={12} spacing={1} direction='column'>
            
            <Grid item container xs={8} spacing={1} alignItems='center'>
                <FieldName xs={2} fieldName={newFlightCompanyFieldName}/>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        value={newFlightCompany}
                        onChange={(event: any) => {
                            setNewFlightCompany(event?.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs ={2}>
                    <UpdateButton 
                        onClick={() => saveNewFlightCompany(newFlightCompany)}
                        text={addText}
                        disabled={newFlightCompany === ''}
                    />      
                </Grid>
            </Grid>

            <Grid item container xs={8} spacing={1} alignItems='center'>
                <FieldName xs={2} fieldName={newFlightNumberFieldName}/>
                <Grid item xs={4}>
                    <Autocomplete
                        options={formattedAirlines}
                        getOptionLabel={(option) => option.displayName}
                        value={flightCompany}
                        onChange={(event, chosenAirline) => { 
                            setFlightCompany(chosenAirline);
                        }}
                        renderInput={(params) => 
                            <TextField
                                placeholder={flightCompanyFieldName}
                                {...params}
                            />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        value={newFlightNumber}
                        onChange={(event: any) => {
                            setNewFlightNumber(event?.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs ={2}>
                    <UpdateButton 
                        onClick={() => saveNewFlightNumber(flightCompany, newFlightNumber)}
                        text={addText}
                        disabled={newFlightNumber === '' || !flightCompany}
                    />      
                </Grid>
            </Grid>

        </Grid>
    )
};

export default AdminDBAction;