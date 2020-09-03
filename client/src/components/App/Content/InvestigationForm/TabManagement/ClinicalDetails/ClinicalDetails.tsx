import React from 'react';
import { format } from 'date-fns';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { Check } from 'models/Check';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { ClinicalDetailsDataContextConsumer, ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

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
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');
    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundIllnessesToggle, hasTroubleIsolatingToggle, wasHospitalizedToggle } = useClinicalDetails(
        {
            setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses, setHasTroubleIsolating, setWasHospitalized
        });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const updateClinicalDetails = (context: ClinicalDetailsDataAndSet, fieldToUpdate: any, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const handleChecklistCheck = (checkId: number, checkList: Check[]) => {
        let updatedSymptoms = [...checkList];
        updatedSymptoms[checkId].isChecked = !updatedSymptoms[checkId].isChecked;
    };

    return (
        <ClinicalDetailsDataContextConsumer>
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
                                    text={'מתאריך'}
                                    value={format(ctxt.clinicalDetailsData?.isolationStartDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                    )}
                                />
                                <DatePick
                                    datePickerType='date'
                                    text={'עד'}
                                    value={format(ctxt.clinicalDetailsData?.isolationEndDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_END_DATE, new Date(event.target.value))
                                    )}
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
                        value={ctxt.clinicalDetailsData?.isolationAddress}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                            updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_ADDRESS, event.target.value)
                        )}
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
                                value={ctxt.clinicalDetailsData?.troubleIsolatingReason}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.TROUBLE_ISOLATING_REASON, event.target.value)
                                )}
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
                                    value={!isUnkonwnDateChecked ? format(ctxt.clinicalDetailsData?.symptomsStartDate as Date, 'yyyy-MM-dd') : 'yyyy-MM-dd'}
                                    text={'תאריך התחלת סימפטומים'}
                                    disabled={isUnkonwnDateChecked}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.SYMPTOMS_START_DATE, new Date(event.target.value))
                                    )}
                                />
                                <CustomCheckbox
                                    checkboxElements={[{value: isUnkonwnDateChecked, text: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())}]}
                                />
                            </div>
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    symptomsList.map((symptom: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                            key={symptom.id}
                                                checkboxElements={[{
                                                    key: symptom.id,
                                                    value: symptom.isChecked,
                                                    text: symptom.name,
                                                    onChange: () => (handleChecklistCheck(symptom.id, symptomsList))
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'
                                    value={otherSymptom}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherSymptom(event.target.value as string)
                                    )}
                                />
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
                                    backgroundIllnessesList.map((backgroundIllness: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                checkboxElements={[{
                                                    key: backgroundIllness.id,
                                                    value: backgroundIllness.isChecked,
                                                    text: backgroundIllness.name,
                                                    onChange: () => (handleChecklistCheck(backgroundIllness.id, backgroundIllnessesList))
                                                }]}
                                            />
                                            
                                        </Grid>
                                    ))
                                }
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן מחלת רקע...'
                                    value={otherBackgroundIllness}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => setOtherBackgroundIllness(event.target.value as string)}
                                />
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
                                    value={ctxt.clinicalDetailsData?.hospital}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITAL, event.target.value)
                                    )}
                                />
                            </div>
                            <div className={classes.dates}>
                                <DatePick
                                    datePickerType='date'
                                    text={'מתאריך'}
                                    value={format(ctxt.clinicalDetailsData?.hospitalStartDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITAL_START_DATE, new Date(event.target.value))
                                    )}
                                />
                                <DatePick
                                    datePickerType='date'
                                    text={'עד'}
                                    value={format(ctxt.clinicalDetailsData?.hospitalEndDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITAL_END_DATE, new Date(event.target.value))
                                    )}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </ClinicalDetailsDataContextConsumer>
    );
};

export default ClinicalDetails;
