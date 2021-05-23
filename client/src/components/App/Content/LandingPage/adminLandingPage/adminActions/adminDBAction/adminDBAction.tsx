import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';

import UpdateButton from '../../UpdateButton/UpdateButton';
import FieldName from 'commons/FieldName/FieldName';

const addText = 'הוספה';
const flightCompanyFieldName = 'חברת תעופה:';
const flightNumberFieldName = 'מספר טיסה:';

const AdminDBAction = (): JSX.Element => {

    const [flightCompany, setFlightCompany] = useState<string>('');
    const [flightNumber, setFlightNumber] = useState<string>('');


    return (
        <Grid container xs={12} spacing={1} direction='column'>
            
            <Grid item container xs={6} spacing={1} alignItems='center'>
                <FieldName xs={2} fieldName={flightCompanyFieldName}/>
                <Grid item xs={5}>
                    <TextField
                        fullWidth
                        value={flightCompany}
                        onChange={(event: any) => {
                            setFlightCompany(event?.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs ={2}>
                    <UpdateButton 
                        onClick={() => console.log('1')}
                        text={addText}
                    />      
                </Grid>
            </Grid>

            <Grid item container xs={6} spacing={1} alignItems='center'>
                <FieldName xs={2} fieldName={flightNumberFieldName}/>
                <Grid item xs={5}>
                    <TextField
                        fullWidth
                        value={flightNumber}
                        onChange={(event: any) => {
                            setFlightNumber(event?.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs ={2}>
                    <UpdateButton 
                        onClick={() => console.log('1')}
                        text={addText}
                    />      
                </Grid>
            </Grid>

        </Grid>
    )
};

export default AdminDBAction;