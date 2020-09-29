import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';
import {
    initialPersonalInfo,
    PersonalInfoContextProvider,
    PersonalInfoDataAndSet,
} from 'commons/Contexts/PersonalInfoStateContext';
import { ClinicalDetailsDataContextProvider, ClinicalDetailsDataAndSet, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';
import {ExposureAndFlightsContextProvider, ExposureAndFlightsDetails,
        initialExposuresAndFlightsData, ExposureAndFlightsDetailsAndSet} from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import TabManagement from './TabManagement/TabManagement';
import useTabManagement from './TabManagement/useTabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

export const LAST_TAB_ID = 4;
const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const interactedContactsState = useContext(interactedContactsContext);

    const formsValidations : (boolean | null)[] = useSelector<StoreStateType, (boolean | null)[]>((state) => state.formsValidations);

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

    const { confirmFinishInvestigation } = useInvestigationForm({ clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables });
    const {
        currentTab,
        moveToNextTab,
        setCurrentTab,
        setNextTab
    } = useTabManagement();

    const isInvestigationValid = () => {
        let isFormValid = true;
        formsValidations.forEach((formValidation)=> {
            if(!formValidation){
                isFormValid = false;
            }
        })
        return isFormValid;
    }

    const handleClick = () => {
        if(currentTab === LAST_TAB_ID){
            setNextTab(currentTab);
            if(isInvestigationValid()){
                confirmFinishInvestigation(epidemiologyNumber);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'חלק מן השדות אינם תקניים, נא מלא אותם מחדש ונסה שוב.'
                });
            }
        } else {
            setNextTab(currentTab+1);
        }
    }

    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                    <PersonalInfoContextProvider value={personalInfoValue}>
                        <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                            <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                                <InvestigationInfoBar
                                    currentTab = {currentTab}
                                />
                                    <div className={classes.interactiveForm}>
                                        <TabManagement
                                            currentTab = {currentTab}
                                            moveToNextTab = {moveToNextTab}
                                            setCurrentTab = {setCurrentTab}
                                            setNextTab = {setNextTab}
                                        />
                                        <div className={classes.buttonSection}>
                                            <PrimaryButton 
                                                type="submit"
                                                form={`form-${currentTab}`}
                                                test-id={currentTab === LAST_TAB_ID ? 'endInvestigation' : 'continueToNextStage'}
                                                onClick={handleClick}
                                                disabled={false}>
                                            {currentTab === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
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
