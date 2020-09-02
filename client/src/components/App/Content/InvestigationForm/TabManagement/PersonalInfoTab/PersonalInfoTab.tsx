import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography, RadioGroup, Radio, ThemeProvider } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import RelevantOccupations from 'models/enums/RelevantOccupations'
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { PersonalInfoContextConsumer, personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';


import useStyles from './PersonalInfoTabStyles';
import IdentificationTypes from 'models/enums/IdentificationTypes';

const PersonalInfoTab: React.FC<Props> = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <PersonalInfoContextConsumer>
            {
                ctxt => (
                    <div className={classes.tabInitialContainer}>
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
                                    control={
                                        <div className={classes.personalId}>
                                            <CircleSelect
                                                native
                                                value={""}
                                                placeholder={'שלום'}
                                                options={['1', '2', '3']}
                                                className={classes.selectWidth}
                                            />
                                        </div>
                                    }
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
                                    value={age}
                                    size='small'
                                    className={classes.ageText}
                                    onChange={(event) => {
                                        setAge(event.target.value);
                                        ctxt.age = event.target.value;
                                    }}
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
                                <CircleSelect
                                    native
                                    value={"Ten"}
                                    options={['1', '2', '3']}
                                    className={classes.selectWidth}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                                <Typography className={classes.fontSize15}>
                                    <b>
                                        קופת חולים:
                                    </b>
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <CircleSelect
                                    native
                                    value={0}
                                    options={['1', '2', '3']}
                                    className={classes.selectWidth}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                            <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                                <Typography className={classes.fontSize15}>
                                    <b>
                                        כתובת:
                                    </b>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <CircleTextField 
                                    id="adress" 
                                    placeholder="מחכה לסנדי:" 
                                    size='small'
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} className={classes.containerGrid} alignItems='baseline'>          
                            <Grid item xs={2} className={classes.personalInfoLastFieldContainer}>
                                <Typography className={classes.fontSize15}>
                                    <b>
                                        האם עובד באחד מהבאים:
                                    </b>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" name="gender1" >
                                        <FormLabel component="legend" className={classes.fontSize15}><b>תעסוקה</b></FormLabel>
                                        { 
                                            Object.values(RelevantOccupations).map((occupation) => {
                                                return <FormControlLabel 
                                                            value={occupation} 
                                                            control={<Radio color='primary'/>} 
                                                            label={<span style={{ fontSize: '15px' }}>{occupation}</span>} 
                                                        />
                                            })
                                        }   
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <CircleSelect
                                    native
                                    value={""}
                                    placeholder={'הזן שם מוסד'}
                                    options={['1', '2', '3']}
                                    className={classes.institutionName}
                                />
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        </PersonalInfoContextConsumer>
    );
};

interface Props {

}

export default PersonalInfoTab;