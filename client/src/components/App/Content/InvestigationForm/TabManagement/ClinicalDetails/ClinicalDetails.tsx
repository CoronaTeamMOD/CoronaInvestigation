import React from 'react';
import { format } from 'date-fns';
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, Collapse } from '@material-ui/core';

import City from 'models/City';
import Gender from 'models/enums/Gender';
import Street from 'models/enums/Street';
import { useSelector } from 'react-redux';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { clinicalDetailsDataContext } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

const dateFormat = 'yyyy-MM-dd';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundDiseases, setHasBackgroundDiseases] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
    const [selectedBackgroundDiseases, setSelectedBackgroundDiseases] = React.useState<string[]>([]);
    const [isOtherSymptomChecked, setIsOtherSymptomChecked] = React.useState<boolean>(false);
    const [isOtherBackgroundIllnessChecked, setIsOtherBackgroundIllnessChecked] = React.useState<boolean>(false);
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const context = React.useContext(clinicalDetailsDataContext);
    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { hasBackgroundDeseasesToggle, getStreetByCity, updateClinicalDetails, updateIsolationAddress } = useClinicalDetails({
        setHasBackgroundDiseases, setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    });

    React.useEffect(() => {
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms);
    }, [selectedSymptoms]);

    React.useEffect(() => {
        updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases);
    }, [selectedBackgroundDiseases]);

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
    };

    const checkIfOtherField = (checkedField: string) => (
        checkedField === 'אחר'
    );

    const handleSymptomCheck = (checkedSymptom: string) => {
        if (selectedSymptoms.includes(checkedSymptom)) {
            setSelectedSymptoms(selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(false);
            }
        } else {
            selectedSymptoms.push(checkedSymptom);
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(true);
            }
        }
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: string) => {
        if (selectedBackgroundDiseases.find(checkedBackgroundIllness => checkedBackgroundIllness === backgroundIllness)) {
            setSelectedBackgroundDiseases(selectedBackgroundDiseases.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness));
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(false);
        } else {
            selectedBackgroundDiseases.push(backgroundIllness);
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(true);
        };
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
                        test-id='isInQuarantine'
                        value={context.clinicalDetailsData.isInIsolation}
                        onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_IN_ISOLATION, !context.clinicalDetailsData.isInIsolation)}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={context.clinicalDetailsData.isInIsolation}>
                        <div className={classes.dates}>
                            <DatePick
                                test-id='quarantinedFromDate'
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData.isolationStartDate !== null ? format(context.clinicalDetailsData.isolationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                test-id='quarantinedUntilDate'
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData.isolationEndDate !== null ? format(context.clinicalDetailsData.isolationEndDate as Date, dateFormat) : dateFormat}
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
                <Autocomplete
                    test-id='currentQuarantineAddress'
                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                    getOptionLabel={(option) => option.value.displayName}
                    inputValue={isolationCityName}
                    onChange={(event, selectedCity) => {
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_CITY, selectedCity?.id)
                        selectedCity && getStreetByCity(selectedCity.id)}
                    }
                    onInputChange={(event, selectedCityName) => {
                        setIsolationCityName(selectedCityName);
                    }}
                    renderInput={(params) =>
                        <CircleTextField
                            {...params}
                            placeholder='עיר'
                            className={classes.textField}
                        />
                    }
                />
                <Autocomplete
                    options={streetsInCity}
                    getOptionLabel={(option) => option.displayName}
                    inputValue={isolationStreetName}
                    onChange={(event, selectedStreet) => {
                        selectedStreet && updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, selectedStreet.id)}
                    }
                    onInputChange={(event, selectedStreetName) => {
                        setIsolationStreetName(selectedStreetName);
                    }}
                    renderInput={(params) =>
                        <CircleTextField
                            {...params}
                            placeholder='רחוב'
                            className={classes.textField}
                        />
                    }
                />
                <CircleTextField
                    test-id='currentQuarantineAddress'
                    size='small'
                    placeholder='מספר הבית'
                    className={classes.textField}
                    value={context.clinicalDetailsData.isolationAddress.houseNum}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER, event.target.value)
                    )}
                />
                <CircleTextField
                    size='small'
                    placeholder='קומה'
                    className={classes.textField}
                    value={context.clinicalDetailsData.isolationAddress.floor}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_FLOOR, event.target.value)
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
                    test-id='isQuarantineProblematic'
                    value={context.clinicalDetailsData.isIsolationProblem}
                    onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM, !context.clinicalDetailsData.isIsolationProblem)}
                />
                <Collapse in={context.clinicalDetailsData.isIsolationProblem}>
                    <CircleTextField
                        test-id='problematicQuarantineReason'
                        value={context.clinicalDetailsData.isIsolationProblemMoreInfo}
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
                        test-id='areThereSymptoms'
                        value={context.clinicalDetailsData.doesHaveSymptoms}
                        onChange={() => updateClinicalDetails(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, !context.clinicalDetailsData.doesHaveSymptoms)}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={context.clinicalDetailsData.doesHaveSymptoms}>
                        <div className={classes.dates}>
                            <DatePick
                                test-id='symptomsStartDate'
                                type='date'
                                value={(!isUnkonwnDateChecked && context.clinicalDetailsData.symptomsStartDate !== null) ? format(context.clinicalDetailsData.symptomsStartDate as Date, dateFormat) : dateFormat}
                                lableText='תאריך התחלת סימפטומים'
                                disabled={isUnkonwnDateChecked}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <CustomCheckbox
                                test-id='unkownSymptomsDate'
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked, labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                        {
                            context.clinicalDetailsData.doesHaveSymptoms &&
                            <Typography>סימפטומים:</Typography>
                        }
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
                            <Collapse in={isOtherSymptomChecked}>
                                <CircleTextField
                                    test-id='symptomInput'
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'
                                    onBlur={(event: React.ChangeEvent<{ value: unknown }>) => (
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
                        test-id='areThereBackgroundDiseases'
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
                            <Collapse in={isOtherBackgroundIllnessChecked}>
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן מחלת רקע...'
                                    onBlur={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherBackgroundIllness(event.target.value as string)
                                    )}
                                />
                            </Collapse>
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
                        test-id='wasHospitalized'
                        value={context.clinicalDetailsData.wasHospitalized}
                        onChange={() => updateClinicalDetails(ClinicalDetailsFields.WAS_HOPITALIZED, !context.clinicalDetailsData.wasHospitalized)}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={context.clinicalDetailsData.wasHospitalized}>
                        <div className={classes.dates}>
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <CircleTextField
                                test-id='hospitalInput'
                                value={context.clinicalDetailsData.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.dates}>
                            <DatePick
                                test-id='wasHospitalizedFromDate'
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData.hospitalizationStartDate !== null ? format(context.clinicalDetailsData.hospitalizationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                test-id='wasHospitalizedUntilDate'
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData.hospitalizationEndDate !== null ? format(context.clinicalDetailsData.hospitalizationEndDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                {patientGender === Gender.FEMALE ?
                    <>
                        <Grid item xs={2}>
                            <Typography>
                                <b>
                                    האם בהריון:
                                </b>
                            </Typography>
                        </Grid>
                        <Toggle
                            test-id='isPregnant'
                            value={context.clinicalDetailsData.isPregnant}
                            onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_PREGNANT, !context.clinicalDetailsData.isPregnant)}
                        />
                    </>
                    : <></>
                }
            </Grid>
        </div>
    );
};

export default ClinicalDetails;
