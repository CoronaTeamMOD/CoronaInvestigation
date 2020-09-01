import React from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { Check } from 'models/Check';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestiationDateVariables/StartInvestigationDateVariables';

const symptomsList: Check[] = [
    {
        id: 0,
        name: 'first',
        isChecked: false
    },
    {
        id: 1,
        name: 'second',
        isChecked: false
    },
    {
        id: 2,
        name: 'third',
        isChecked: false
    },
    {
        id: 3,
        name: 'fourth',
        isChecked: false
    },
    {
        id: 4,
        name: 'אחר',
        isChecked: false
    },
];

const backgroundIllnessesList: Check[] = [
    {
        id: 0,
        name: 'one',
        isChecked: false
    },
    {
        id: 1,
        name: 'two',
        isChecked: false
    },
    {
        id: 2,
        name: 'three',
        isChecked: false
    },
    {
        id: 3,
        name: 'four',
        isChecked: false
    },
    {
        id: 4,
        name: 'אחר',
        isChecked: false
    },

];

const hospitals: string[] = ['שיבא', 'איכילוב', 'אסף הרופא'];

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundIllnesses, setHasBackgroundIllnesses] = React.useState<boolean>(false);
    const [hasTroubleIsolating, setHasTroubleIsolating] = React.useState<boolean>(false);
    const [wasHospitalized, setWasHospitalized] = React.useState<boolean>(false);
    const [symptoms, setSymptoms] = React.useState<Check[]>(symptomsList);
    const [backgroundIllnesses, setBackgroundIllnesses] = React.useState<Check[]>(backgroundIllnessesList);
    const [isolationStartDate, setIsolationStartDate] = React.useState<string>('');
    const [isolationEndDate, setIsolationEndDate] = React.useState<string>('');
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<string>('');
    const [hospitalStartDate, setHospitalStartDate] = React.useState<string>('');
    const [hospitalEndDate, setHospitalEndDate] = React.useState<string>('');
    const [troubleIsolatingReason, setTroubleIsolatingReason] = React.useState<string>('');
    const [hospital, setHospital] = React.useState<string>(hospitals[0]);

    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundIllnessesToggle, hasTroubleIsolatingToggle, wasHospitalizedToggle } = useClinicalDetails(
        {
            setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses, setHasTroubleIsolating, setWasHospitalized
        });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const handleChecklistCheck = (checkId: number, checkList: Check[]) => {
        let updatedSymptoms = [...checkList];
        updatedSymptoms[checkId].isChecked = !updatedSymptoms[checkId].isChecked;
        //setSymptoms(updatedSymptoms);
        //setBackgroundIllnesses(updatedackgroundIllnesses);
    };

    return (
        <StartInvestigationDateVariablesConsumer>
            {ctxt => (
                <Grid className={classes.form} container justify='flex-start' alignItems='center'>
                    {/* האם שהית בבידוד */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם שהית בבידוד:
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Toggle
                            value={isInIsolation}
                            onChange={isInIsolationToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={isInIsolation}>
                            <div className={classes.dates}>
                                <DatePick
                                    datePickerType='date'
                                    value={isolationStartDate}
                                    text={'מתאריך'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsolationStartDate(event.target.value)}
                                />
                                <DatePick
                                    datePickerType='date'
                                    value={isolationEndDate}
                                    text={'עד'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsolationEndDate(event.target.value)}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                    <br />
                    <br />
                    {/* כתובת לבידוד נוכחי */}
                    <Typography>
                        <b>
                            כתובת לבידוד נוכחי:
                        </b>
                    </Typography>
                    <CircleTextField
                        size='small'
                        placeholder='כתובת'
                        className={classes.textField}
                    />
                    <Grid item xs={12}>
                    </Grid>
                    <br />
                    <br />
                    {/* האם בעייתי לקיים בידוד */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם בעייתי לקיים בידוד:
                            </b>
                        </Typography>
                    </Grid>
                        <Toggle
                            value={hasTroubleIsolating}
                            onChange={hasTroubleIsolatingToggle}
                        />
                        <Collapse in={hasTroubleIsolating}>
                            <CircleTextField
                                value={troubleIsolatingReason}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTroubleIsolatingReason(event.target.value)}
                                size='small'
                                className={classes.textField}
                                placeholder='הכנס סיבה:'
                            />
                        </Collapse>
                    <Grid item xs={12}>
                    </Grid>
                    <br />
                    <br />
                    {/* האם יש סימפטומים */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם יש סימפטומים:
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Toggle
                            value={hasSymptoms}
                            onChange={hasSymptomsToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={hasSymptoms}>
                            <div className={classes.dates}>
                                <DatePick
                                    datePickerType='date'
                                    value={symptomsStartDate}
                                    text={'תאריך התחלת סימפטומים'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSymptomsStartDate(event.target.value)}
                                />
                                <CustomCheckbox
                                    checkboxElements={[{value: isUnkonwnDateChecked, text: 'תאריך התחלת סימפטומים לא ידוע', onChange: () => (handleUnkonwnDateCheck())}]}
                                />
                            </div>
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    symptoms.map((symptom: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                            key={symptom.id}
                                                checkboxElements={[{
                                                    key: symptom.id,
                                                    value: symptom.isChecked,
                                                    text: symptom.name,
                                                    onChange: () => (handleChecklistCheck(symptom.id, symptoms))
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Collapse>
                    </Grid>
                    <br />
                    <br />
                    {/* האם יש לך מחלות רקע */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם יש לך מחלות רקע:
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Toggle
                            value={hasBackgroundIllnesses}
                            onChange={hasBackgroundIllnessesToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={hasBackgroundIllnesses}>
                            <Grid container className={classes.smallGrid}>
                                {
                                    backgroundIllnesses.map((backgroundIllness: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                checkboxElements={[{
                                                    key: backgroundIllness.id,
                                                    value: backgroundIllness.isChecked,
                                                    text: backgroundIllness.name,
                                                    onChange: () => (handleChecklistCheck(backgroundIllness.id, backgroundIllnesses))
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Collapse>
                    </Grid>
                    <br/>
                    <br/>
                    {/* האם אושפז */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם אושפז:
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Toggle
                            value={wasHospitalized}
                            onChange={wasHospitalizedToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={wasHospitalized}>
                            <div className={classes.dates}>
                                <Typography style={{marginTop: '0.7%'}}>
                                    <b>
                                        בית חולים:
                                    </b>
                                </Typography>
                                <CircleSelect
                                    options={hospitals}
                                    value={hospital}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => setHospital(event.target.value as string)}
                                />
                            </div>
                            <div className={classes.dates}>
                                <DatePick
                                    datePickerType='date'
                                    value={hospitalStartDate}
                                    text={'מתאריך'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHospitalStartDate(event.target.value)}
                                />
                                <DatePick
                                    datePickerType='date'
                                    value={hospitalEndDate}
                                    text={'עד'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHospitalEndDate(event.target.value)}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </StartInvestigationDateVariablesConsumer>
    );
};

export default ClinicalDetails;
