import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import StoreStateType from 'redux/storeStateType';
import { Grid, Typography, Collapse, TextField } from '@material-ui/core';

import City from 'models/City';
import Gender from 'models/enums/Gender';
import Street from 'models/enums/Street';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import { dateFormatForDatePicker } from 'Utils/displayUtils';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { clinicalDetailsDataContext } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const context = React.useContext(clinicalDetailsDataContext);
    const { city, street } = context.clinicalDetailsData.isolationAddress;

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [isOtherSymptomChecked, setIsOtherSymptomChecked] = React.useState<boolean>(false);
    const [isOtherBackgroundIllnessChecked, setIsOtherBackgroundIllnessChecked] = React.useState<boolean>(false);
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { hasBackgroundDeseasesToggle, getStreetByCity, updateClinicalDetails, updateIsolationAddress, updateIsolationAddressOnCityChange } = useClinicalDetails({
        setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    });

    React.useEffect(() => {
        if (context.clinicalDetailsData.symptoms.length > 0) {
            setIsUnkonwnDateChecked(context.clinicalDetailsData.symptomsStartDate === null)
        }
    }, [context.clinicalDetailsData.symptomsStartDate, context.clinicalDetailsData.symptoms])

    React.useEffect(() => {
        getStreetByCity(city);
    }, [city])

    React.useEffect(() => {
        if (streetsInCity.length > 0 && street === '') {
            updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, streetsInCity[0].id);
            setIsolationStreetName(streetsInCity[0].displayName);
        }
    }, [streetsInCity])

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
    };

    const checkIfOtherField = (checkedField: string) => (
        checkedField === 'אחר'
    );

    const handleSymptomCheck = (checkedSymptom: string) => {
        let selectedSymptoms = context.clinicalDetailsData.symptoms;

        if (selectedSymptoms.includes(checkedSymptom)) {
            updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(false);
            }
        } else {
            selectedSymptoms.push(checkedSymptom);
            updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms);
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(true);
            }
        }
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: string) => {
        let selectedBackgroundDiseases = context.clinicalDetailsData.backgroundDeseases;

        if (selectedBackgroundDiseases.includes(backgroundIllness)) {
            updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness));
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(false);
        } else {
            selectedBackgroundDiseases.push(backgroundIllness);
            updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases);
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(true);
        };
    };

    const updateDateOnBlur = (event: React.FocusEvent<HTMLInputElement>, fieldName: ClinicalDetailsFields) => {
        const newDate = event.target.value ? new Date(event.target.value) : null
        updateClinicalDetails(fieldName, newDate);
    }
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
                                required
                                test-id='quarantinedFromDate'
                                type='date'
                                lableText='מתאריך'
                                defaultValue={context.clinicalDetailsData.isolationStartDate !== null ? format(context.clinicalDetailsData.isolationStartDate as Date, dateFormatForDatePicker) : dateFormatForDatePicker}
                                onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,ClinicalDetailsFields.ISOLATION_START_DATE)}
                            />
                            <DatePick
                                required
                                test-id='quarantinedUntilDate'
                                type='date'
                                lableText='עד'
                                defaultValue={context.clinicalDetailsData.isolationEndDate !== null ? format(context.clinicalDetailsData.isolationEndDate as Date, dateFormatForDatePicker) : dateFormatForDatePicker}
                                onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,ClinicalDetailsFields.ISOLATION_END_DATE)}
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
                    test-id='currentQuarantineCity'
                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                    getOptionLabel={(option) => option.value.displayName}
                    inputValue={isolationCityName}
                    onChange={(event, selectedCity) => updateIsolationAddressOnCityChange(selectedCity === null ? '' : selectedCity.id)}
                    onInputChange={(event, selectedCityName) => setIsolationCityName(selectedCityName)}
                    renderInput={(params) =>
                        <TextField
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
                    onChange={(event, selectedStreet) => updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, selectedStreet === null ? '' : selectedStreet.id)}
                    onInputChange={(event, selectedStreetName) => setIsolationStreetName(selectedStreetName)}
                    renderInput={(params) =>
                        <TextField
                            test-id='currentQuarantineStreet'
                            {...params}
                            placeholder='רחוב'
                            className={classes.textField}
                        />
                    }
                />
                <TextField
                    test-id='currentQuarantineHomeNumber'
                    size='small'
                    placeholder='מספר הבית'
                    className={classes.textField}
                    value={context.clinicalDetailsData.isolationAddress.houseNum}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER, event.target.value)
                    )}
                />
                <TextField
                    test-id='currentQuarantineFloor'
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
                    <TextField
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
                                required={!isUnkonwnDateChecked}
                                label={!isUnkonwnDateChecked && "תאריך התחלת סימפטומים"}
                                test-id='symptomsStartDate'
                                type='date'
                                defaultValue={(!isUnkonwnDateChecked && context.clinicalDetailsData.symptomsStartDate !== null) ? format(context.clinicalDetailsData.symptomsStartDate as Date, dateFormatForDatePicker) : dateFormatForDatePicker}
                                lableText='תאריך התחלת סימפטומים'
                                disabled={isUnkonwnDateChecked}
                                onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,ClinicalDetailsFields.SYMPTOMS_START_DATE)}
                            />
                            <CustomCheckbox
                                testId='unkownSymptomsDate'
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked,
                                    labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    checked: isUnkonwnDateChecked,
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                        {
                            context.clinicalDetailsData.doesHaveSymptoms &&
                            <Typography>סימפטומים: (יש לבחור לפחות סימפטום אחד)</Typography>
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
                                                checked: context.clinicalDetailsData.symptoms.includes(symptom),
                                                onChange: () => {
                                                    handleSymptomCheck(symptom)
                                                }
                                            }]}
                                        />
                                    </Grid>
                                ))
                            }
                            <Collapse in={isOtherSymptomChecked}>
                                <TextField
                                    required
                                    label="סימפטום"
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
                        value={context.clinicalDetailsData.doesHaveBackgroundDiseases}
                        onChange={hasBackgroundDeseasesToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={context.clinicalDetailsData.doesHaveBackgroundDiseases}>
                    <Typography>מחלות רקע: (יש לבחור לפחות מחלת רקע אחת)</Typography>
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
                                                checked: context.clinicalDetailsData.backgroundDeseases.includes(backgroundIllness),
                                                onChange: () => {
                                                    handleBackgroundIllnessCheck(backgroundIllness)
                                                }
                                            }]}
                                        />
                                    </Grid>
                                ))
                            }
                            <Collapse in={isOtherBackgroundIllnessChecked}>
                                <TextField
                                    required
                                    label="מחלת רקע"
                                    test-id='otherBackgroundDisease'
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
                            <TextField
                                required
                                label="בית חולים"
                                test-id='hospitalInput'
                                value={context.clinicalDetailsData.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.dates}>
                            <DatePick
                                required
                                label="מתאריך"
                                test-id='wasHospitalizedFromDate'
                                type='date'
                                lableText='מתאריך'
                                defaultValue={context.clinicalDetailsData.hospitalizationStartDate !== null ? format(context.clinicalDetailsData.hospitalizationStartDate as Date, dateFormatForDatePicker) : dateFormatForDatePicker}
                                onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,ClinicalDetailsFields.HOSPITALIZATION_START_DATE)}
                            />
                            <DatePick
                                required
                                label="עד"
                                test-id='wasHospitalizedUntilDate'
                                type='date'
                                lableText='עד'
                                defaultValue={context.clinicalDetailsData.hospitalizationEndDate !== null ? format(context.clinicalDetailsData.hospitalizationEndDate as Date, dateFormatForDatePicker) : dateFormatForDatePicker}
                                onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,ClinicalDetailsFields.HOSPITALIZATION_END_DATE)}
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