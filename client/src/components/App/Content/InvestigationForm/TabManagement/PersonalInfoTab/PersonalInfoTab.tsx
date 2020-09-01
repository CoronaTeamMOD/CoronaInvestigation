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

import Toggle from 'commons/Toggle/Toggle';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';

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
        <div className={classes.tabInitialPadding}>
        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        טלפון:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <CircleTextField 
                    id="phone" 
                    placeholder="טלפון:" 
                    size='small'
                />
            </Grid>
            <Grid item xs={2}>
                <CustomCheckbox
                    checkboxElements={[{text: <span style={{ fontSize: '15px'}}>מספר הטלפון לא שייך לנבדק</span>}]}
                />
            </Grid>
            <Grid item xs={2}>
                <FormControlLabel 
                    className={classes.unsetFormControlMargin}
                    control={<CircleTextField 
                        select
                        id="reasonPhoneNotChecked" 
                        className={classes.selectReason}
                        size='small'
                    />}
                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>סיבה:</span>}
                    labelPlacement='start'
                />
            </Grid>
            <Grid item xs={4} className={classes.PersonalInfoFieldContainer}>
                <CircleTextField 
                    id="standard-required" 
                    placeholder="כתוב סיבה..." 
                    size='small' 
                    className={classes.writeReason}
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        טלפון נוסף:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <CircleTextField 
                    id="phone2" 
                    placeholder="טלפון:" 
                    size='small'
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
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

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        סוג תעודה מזהה:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                <Toggle 
                    toggleValue={false}
                    toggleChangeFunc={function f(event: any, value: boolean) {

                    }}
                    firstOption={'ת.ז'}
                    secondOption={'דרכון'} />
            </Grid>
            <Grid item xs={3}>
                <FormControlLabel
                    className={classes.unsetFormControlMargin}
                    control={<CircleTextField
                        id="personalId" 
                        className={classes.personalId}
                        size='small'
                    />}
                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>מספר תעודה מזהה:</span>}
                    labelPlacement='start'
                />
            </Grid>
        </Grid>
        
        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        גיל:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <CircleTextField 
                    id="age" 
                    placeholder="גיל:" 
                    size='small'
                    className={classes.ageText}
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                       שמות הורי הקטין:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <FormControlLabel
                    className={classes.unsetFormControlMargin}
                    control={<CircleTextField
                        id="motherName" 
                        className={classes.personalId}
                        size='small'
                        placeholder='שם:'
                    />}
                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>שם האם:</span>}
                    labelPlacement='start'
                />
            </Grid>
            <Grid item xs={2}>
                <FormControlLabel
                    className={classes.unsetFormControlMargin}
                    control={<CircleTextField
                        id="fatherName" 
                        className={classes.personalId}
                        size='small'
                        placeholder='שם:'
                    />}
                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>שם האב:</span>}
                    labelPlacement='start'
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                <Typography className={classes.fontSize15}>
                    <b>
                        גורם מבטח:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <CircleTextField 
                    select
                    className={classes.inSuranceSelect}
                    id="insurance" 
                    size='small'
                    label='ביטוח'
                />
            </Grid>
        </Grid>
        </div>
    )
};

interface Props {

}

export default PersonalInfoTab;