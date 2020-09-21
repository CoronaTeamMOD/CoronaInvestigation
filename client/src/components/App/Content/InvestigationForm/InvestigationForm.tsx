import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import StoreStateType from 'redux/storeStateType';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import Observer from 'commons/ObserverDP/Observer';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import {
    initialPersonalInfo,
    PersonalInfoContextProvider,
    PersonalInfoDataAndSet,
    personalInfoContext
} from 'commons/Contexts/PersonalInfoStateContext';
import { ClinicalDetailsDataContextProvider, ClinicalDetailsDataAndSet, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';
import {ExposureAndFlightsContextProvider, ExposureAndFlightsDetails,
        initialExposuresAndFlightsData, ExposureAndFlightsDetailsAndSet} from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import { tabs } from './TabManagement/TabManagement';
import TabManagement from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';


export const LAST_TAB_ID = 3;
export const tabsObserver = new Observer();
const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [personalInfoData, setPersonalInfoData] = React.useState<personalInfoContextData>(initialPersonalInfo);

    const personalInfoValue: PersonalInfoDataAndSet = React.useMemo(
        () => ({
            personalInfoData,
            setPersonalInfoData

        }),
        [personalInfoData, setPersonalInfoData]
    );

    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [exposureAndFlightsData, setExposureDataAndFlights] = React.useState<ExposureAndFlightsDetails>(initialExposuresAndFlightsData)
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<Date>();
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [endInvestigationDate, setEndInvestigationDate] = React.useState<Date>(new Date());
    const [clinicalDetailsData, setClinicalDetailsData] = React.useState<ClinicalDetailsData>(initialClinicalDetails);

    const clinicalDetailsVariables: ClinicalDetailsDataAndSet = React.useMemo(() => ({
        clinicalDetailsData,
        setClinicalDetailsData
    }),
        [clinicalDetailsData, setClinicalDetailsData]
    );

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
        [exposureDate, symptomsStartDate, hasSymptoms, endInvestigationDate,
            setSymptomsStartDate, setExposureDate, setHasSymptoms, setEndInvestigationDate]
    );

    const { currentTab, setCurrentTab, confirmFinishInvestigation, handleSwitchTab, saveCurrentTab, isButtonDisabled } = useInvestigationForm({ clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables });

    const shouldDisableButton = isButtonDisabled(currentTab.name);
    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                <PersonalInfoContextProvider value={personalInfoValue}>
                    <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                        <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                            <InvestigationInfoBar
                                onExitInvestigation={saveCurrentTab}
                            />
                                <div className={classes.interactiveForm}>
                                    <TabManagement
                                        currentTab={currentTab}
                                        setCurrentTab={setCurrentTab}
                                        onTabClicked={() => shouldDisableButton ? setShowSnackbar(true) : tabsObserver.notifySpecific(currentTab.id)}
                                        shouldDisableChangeTab={shouldDisableButton}
                                    />
                                    <div className={classes.buttonSection}>
                                        <PrimaryButton test-id={currentTab.id === LAST_TAB_ID ? 'endInvestigation' : 'continueToNextStage'}
                                            onClick={() => {
                                                tabsObserver.notifySpecific(currentTab.id);
                                                setCurrentTab(tabs[(currentTab.id + 1) % tabs.length]);
                                            }}
                                            disabled={shouldDisableButton}>
                                           {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </StartInvestigationDateVariablesProvider>
                        </ClinicalDetailsDataContextProvider>
                    </PersonalInfoContextProvider>
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
