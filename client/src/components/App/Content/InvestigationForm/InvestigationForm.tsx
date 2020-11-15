import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import {ExposureAndFlightsContextProvider, ExposureAndFlightsDetails,
        initialExposuresAndFlightsData, ExposureAndFlightsDetailsAndSet} from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import useTabManagement from './TabManagement/useTabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import TabManagement from './TabManagement/TabManagement';
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
        lastTabDisplayedId
    } = useTabManagement();

    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                    <InvestigationInfoBar
                        currentTab = {currentTab}
                    />
                        <div className={classes.interactiveForm}>
                            <TabManagement
                                areThereContacts={areThereContacts}
                                setAreThereContacts={setAreThereContacts}
                                currentTab={currentTab}
                                setNextTab={setNextTab}
                            />
                            <div className={classes.buttonSection}>
                                <PrimaryButton 
                                    type="submit"
                                    form={`form-${currentTab}`}
                                    test-id={currentTab === lastTabDisplayedId ? 'endInvestigation' : 'continueToNextStage'}
                                    onClick={() => setNextTab(currentTab + 1)}                                    
                                >
                                {currentTab === lastTabDisplayedId ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                                </PrimaryButton>
                            </div>
                        </div>
                </StartInvestigationDateVariablesProvider>
            </ExposureAndFlightsContextProvider>

            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert onClose={() => setShowSnackbar(false)} severity="warning" elevation={6} variant="filled">
                    חלק מן השדות אינם תקניים, נא מלא אותם מחדש ונסה שוב.
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default InvestigationForm;