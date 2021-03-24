import React, { useEffect } from 'react';
import { Grid, Paper, Card } from '@material-ui/core';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import { setFormState } from 'redux/Form/formActionCreators';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import {ExposureAndFlightsContextProvider, ExposureAndFlightsDetails,
        initialExposuresAndFlightsData, ExposureAndFlightsDetailsAndSet} from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import useGroupedInvestigationContacts from './useGroupedInvestigationContacts';
import useTabManagement ,{ LAST_TAB_ID } from './TabManagement/useTabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import TabManagement from './TabManagement/TabManagement';
import TrackingRecommendationForm from './TrackingRecommendation/TrackingRecommendationForm';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [exposureAndFlightsData, setExposureDataAndFlights] = React.useState<ExposureAndFlightsDetails>(initialExposuresAndFlightsData)
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<Date>();
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [endInvestigationDate, setEndInvestigationDate] = React.useState<Date>(new Date());
    const [lastTabDisplayedId, setLastTabDisplayedId] = React.useState<number>(LAST_TAB_ID - 1);
    const [isScriptOpened, setIsScriptOpened] = React.useState<boolean>(true);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const {setGroupedInvestigationsDetailsAsync} = useGroupedInvestigationContacts();

    const exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet = React.useMemo(() => ({
        exposureAndFlightsData,
        setExposureDataAndFlights
    }),
        [exposureAndFlightsData, setExposureDataAndFlights]
    );

    const startInvestigationDateVariables: StartInvestigationDateVariables = React.useMemo(() => ({
        exposureDate,
        symptomsStartDate,
        hasSymptoms,
        endInvestigationDate,
        setExposureDate,
        setSymptomsStartDate,
        setHasSymptoms,
        setEndInvestigationDate,
    }),
        [exposureDate, symptomsStartDate, hasSymptoms, endInvestigationDate, setSymptomsStartDate, setExposureDate, setHasSymptoms, setEndInvestigationDate]
    );

    const { areThereContacts, setAreThereContacts } = useInvestigationForm();
    const {
        currentTab,
        setNextTab,
    } = useTabManagement({lastTabDisplayedId});

    useEffect(() => {
        setLastTabDisplayedId(areThereContacts ? LAST_TAB_ID : LAST_TAB_ID - 1);
        !areThereContacts && setFormState(investigationId, LAST_TAB_ID, true);
    }, [areThereContacts]);

    useEffect(() => {
        setGroupedInvestigationsDetailsAsync();
    }, []);
    
    const isLastTabDisplayed = currentTab === lastTabDisplayedId;

    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                    <InvestigationInfoBar
                        currentTab = {currentTab}
                    />
                        <div className={classes.interactiveForm}>
                            <Grid container spacing={2}>
                                <TabManagement
                                    areThereContacts={areThereContacts}
                                    setAreThereContacts={setAreThereContacts}
                                    currentTab={currentTab}
                                    setNextTab={setNextTab}
                                    isScriptOpened={isScriptOpened}
                                    setIsScriptOpened={setIsScriptOpened}
                                />
                                <Grid item className={isScriptOpened ? classes.uncollapsed : classes.collapsed}>
                                    <Card> //className={classes.scriptWrapper}>
                                        hellooooo
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container alignItems='center' className={classes.buttonSection}>
                                {isLastTabDisplayed && 
                                    <Grid item>
                                        <Paper className={classes.trackingForm}>
                                            <TrackingRecommendationForm/>
                                        </Paper>
                                    </Grid>
                                }
                                <Grid item className={classes.nextButton}>
                                    <PrimaryButton
                                        type='submit'
                                        form={`form-${currentTab}`}
                                        test-id={isLastTabDisplayed ? 'endInvestigation' : 'continueToNextStage'}
                                        onClick={() => setNextTab(currentTab + 1)}                                    
                                    >
                                    {isLastTabDisplayed ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                                    </PrimaryButton>
                                </Grid>
                            </Grid>
                        </div>
                </StartInvestigationDateVariablesProvider>
            </ExposureAndFlightsContextProvider>

            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert onClose={() => setShowSnackbar(false)} severity='warning' elevation={6} variant='filled'>
                    חלק מן השדות אינם תקניים, נא מלא אותם מחדש ונסה שוב.
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default InvestigationForm;