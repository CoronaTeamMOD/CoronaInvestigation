import React, { useEffect } from 'react';
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
import useTabManagement ,{ LAST_TAB_ID } from './TabManagement/useTabManagement';
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
    const [lastTabDisplayedId, setLastTabDisplayedId] = React.useState<number>(LAST_TAB_ID - 1);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

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
                                    type='submit'
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