import React from 'react';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FormControl, InputLabel } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import useStyles from './PersonalInfoTabStyles';

import Toggle from '../../../../../../commons/Toggle/Toggle';
import CircleTextField from '../../../../../../commons/CircleTextField/CircleTextField';

const PersonalInfoTab: React.FC<Props> = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoFields: string[] = [
        'טלפון',
        'מין',
        'סוג תעודה מזהה',
        'גיל',
        'שמות הורי הקטין',
        'קופת חולים',
        'כתובת',
        'האם עובד באחד מהבאים'
    ]
  
    return (
        <>
        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        טלפון:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <CircleTextField id="standard-required" placeholder="טלפון:" size='small'/>
            </Grid>
            <Grid item xs={2}>
                <FormControlLabel 
                    className={classes.fontSize15}
                    control={
                    <Checkbox
                        className={classes.checkboxSize} 
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label={<span style={{ fontSize: '15px'}}>מספר הטלפון לא שייך לנבדק</span>}
                />
            </Grid>
            <Grid item xs={2}>
                <FormControlLabel
                    control={<CircleTextField 
                        select
                        id="standard-required" 
                        className={classes.selectReason}
                        size='small'
                    />}
                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>סיבה:</span>}
                    labelPlacement='start'
                />
            </Grid>
            <Grid item xs={4} className={classes.PersonalInfoFieldContainer}>
                <CircleTextField id="standard-required" placeholder="כתוב סיבה..." size='small' className={classes.writeReason}/>
            </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        מין:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                <Toggle 
                    toggleValue={false}
                    toggleChangeFunc={function f(event: any, value: boolean) {

                    }}
                    firstOption={"זכר"}
                    secondOption={"נקבה"} />
            </Grid>
        </Grid>
        </>
    )
};

interface Props {

}

export default PersonalInfoTab;
