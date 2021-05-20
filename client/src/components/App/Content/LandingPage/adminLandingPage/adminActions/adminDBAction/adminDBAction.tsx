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
        <Grid container xs={12} spacing={2}>
            <Grid item container spacing={2} alignItems='center'>
                <Grid item xs={5}>
                    <p>חברת תעופה</p>
                </Grid>
                <Grid item xs={2}>
                    <UpdateButton 
                        onClick={() => console.log('1')}
                        text={addText}
                    />                 
                </Grid>
          </Grid>

          <Grid item container spacing={2} alignItems='center'>
                <Grid item container xs={5}>
                    <FieldName xs={2} fieldName={flightNumberFieldName}/>
                    <Grid item xs={3}>
                        <TextField
                            value={flightNumber}
                            onChange={(event: any) => {
                                setFlightNumber(event?.target.value)
                            }}
                        />
                    </Grid>
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