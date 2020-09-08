import React from 'react';
import { format } from 'date-fns';
import { Grid, Typography, Collapse } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { clinicalDetailsDataContext } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

const dateFormat = 'yyyy-MM-dd';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundDiseases, setHasBackgroundDiseases] = React.useState<boolean>(false);
    const [wasHospitalized, setWasHospitalized] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
    const [selectedBackgroundDiseases, setSelectedBackgroundDiseases] = React.useState<string[]>([]);
    const [otherSymptomChecked, setOtherSymptomChecked] = React.useState<boolean>(false);

    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundDeseasesToggle, wasHospitalizedToggle } = useClinicalDetails({
        setIsInIsolation, setHasSymptoms, setHasBackgroundDiseases, setWasHospitalized, setSymptoms, setBackgroundDiseases
    });

    const context = React.useContext(clinicalDetailsDataContext);

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
    };

    const updateClinicalDetails = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const handleSymptomCheck = (checkedSymptom: string) => {
        if (selectedSymptoms.includes(checkedSymptom)) {
            setSelectedSymptoms(selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
            if (checkedSymptom === 'אחר') {
                setOtherSymptomChecked(false);
            }
        } else {
            selectedSymptoms.push(checkedSymptom);
            if (checkedSymptom === 'אחר') {
                setOtherSymptomChecked(true);
            }
        }

        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms);
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: string) => {
        if (selectedBackgroundDiseases.find(checkedBackgroundIllness => checkedBackgroundIllness === backgroundIllness)) {
            setSelectedBackgroundDiseases(selectedBackgroundDiseases.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness));
        } else {
            selectedBackgroundDiseases.push(backgroundIllness);
        };

        updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases);
    };

    return (
        <div>
            <Grid spacing={3} className={classes.form} container justify='flex-start' alignItems='center'>
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
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData?.isolationStartDate !== null ? format(context.clinicalDetailsData?.isolationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData?.isolationEndDate !== null ? format(context.clinicalDetailsData?.isolationEndDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                <Typography>
                    <b>
                        כתובת לאשפוז ביתי:
                    </b>
                </Typography>
                <CircleTextField
                    size='small'
                    placeholder='כתובת'
                    className={classes.textField}
                    value={context.clinicalDetailsData?.isolationAddress}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateClinicalDetails(ClinicalDetailsFields.ISOLATION_ADDRESS, event.target.value)
                    )}
                />
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם בעייתי לקיים בידוד:
                        </b>
                    </Typography>
                </Grid>
                <Toggle
                    value={context.clinicalDetailsData?.isIsolationProblem}
                    onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM, !context.clinicalDetailsData?.isIsolationProblem)}
                />
                <Collapse in={context.clinicalDetailsData?.isIsolationProblem}>
                    <CircleTextField
                        value={context.clinicalDetailsData?.isIsolationProblemMoreInfo}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                            updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, event.target.value)
                        )}
                        size='small'
                        className={classes.textField}
                        placeholder='הכנס סיבה:'
                    />
                </Collapse>
                <Grid item xs={12}>
                </Grid>
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
                                type='date'
                                value={(!isUnkonwnDateChecked && context.clinicalDetailsData?.symptomsStartDate !== null) ? format(context.clinicalDetailsData?.symptomsStartDate as Date, dateFormat) : dateFormat}
                                lableText='תאריך התחלת סימפטומים'
                                disabled={isUnkonwnDateChecked}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <CustomCheckbox
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked, labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                        <Typography>סימפטומים:</Typography>
                        <Grid container className={classes.smallGrid}>
                            {
                                symptoms.map((symptom: string) => (
                                    <Grid item xs={6} key={symptom}>
                                        <CustomCheckbox
                                            key={symptom}
                                            checkboxElements={[{
                                                key: symptom,
                                                value: symptoms.find((chosenSymptom) => chosenSymptom === symptom),
                                                labelText: symptom,
                                                onChange: () => {
                                                    handleSymptomCheck(symptom)
                                                }
                                            }]}
                                        />
                                    </Grid>
                                ))
                            }
                            <Collapse in={otherSymptomChecked}>
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'
                                    value={otherSymptom}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherSymptom(event.target.value as string)
                                    )}
                                />
                            </Collapse>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם יש לך מחלות רקע:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        value={hasBackgroundDiseases}
                        onChange={hasBackgroundDeseasesToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={hasBackgroundDiseases}>
                        <Grid container className={classes.smallGrid}>
                            {
                                backgroundDiseases.map((backgroundIllness: string) => (
                                    <Grid item xs={6} key={backgroundIllness}>
                                        <CustomCheckbox
                                            key={backgroundIllness}
                                            checkboxElements={[{
                                                key: backgroundIllness,
                                                value: backgroundDiseases.find((chosenBackgroundIllness) => chosenBackgroundIllness === backgroundIllness),
                                                labelText: backgroundIllness,
                                                onChange: () => {
                                                    handleBackgroundIllnessCheck(backgroundIllness)
                                                }

                                            }]}
                                        />

                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Collapse>
                </Grid>
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
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <CircleTextField
                                value={context.clinicalDetailsData?.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.dates}>
                            <DatePick
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData?.hospitalizationStartDate !== null ? format(context.clinicalDetailsData?.hospitalizationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData?.hospitalizationEndDate !== null ? format(context.clinicalDetailsData?.hospitalizationEndDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם בהריון:
                        </b>
                    </Typography>
                </Grid>
                <Toggle
                    value={context.clinicalDetailsData?.isPregnant}
                    onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_PREGNANT, !context.clinicalDetailsData?.isPregnant)}
                />
            </Grid>
        </div>
    );
};

export default ClinicalDetails;
