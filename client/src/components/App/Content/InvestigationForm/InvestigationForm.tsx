import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
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
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const formsValidations = useSelector<StoreStateType, (boolean | null)[]>((state) => state.formsValidations[investigationId]);

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
        [exposureDate, symptomsStartDate, hasSymptoms, endInvestigationDate, setSymptomsStartDate, setExposureDate, setHasSymptoms, setEndInvestigationDate]
    );

    const { confirmFinishInvestigation, areThereContacts, setAreThereContacts } = useInvestigationForm();
    const {
        currentTab,
        moveToNextTab,
        setNextTab
    } = useTabManagement();

    const lastTabDisplayedId = areThereContacts ? LAST_TAB_ID : LAST_TAB_ID - 1;

    const isInvestigationValid = () => {
        return !(formsValidations.slice(0, lastTabDisplayedId + 1).some((formValidation) => !formValidation));
    }

    const handleNextPageClick = () => {
        if(currentTab === lastTabDisplayedId) { 
            if(isInvestigationValid()) {
                confirmFinishInvestigation(epidemiologyNumber);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'חלק מן השדות אינם תקניים, נא מלא אותם מחדש ונסה שוב.',
                    customClass: {
                        title:classes.swalTitle
                    },
                });
            }
        } else {
            setNextTab(currentTab + 1);
        }
    }

    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                    <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                        <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                            <InvestigationInfoBar
                                currentTab = {currentTab}
                            />
                                <div className={classes.interactiveForm}>
                                    <TabManagement
                                        areThereContacts = {areThereContacts}
                                        setAreThereContacts = {setAreThereContacts}
                                        currentTab = {currentTab}
                                        moveToNextTab = {moveToNextTab}
                                        setNextTab = {setNextTab}
                                    />
                                    <div className={classes.buttonSection}>
                                        <PrimaryButton 
                                            type="submit"
                                            form={`form-${currentTab}`}
                                            test-id={currentTab === lastTabDisplayedId ? 'endInvestigation' : 'continueToNextStage'}
                                            onClick={handleNextPageClick}>
                                        {currentTab === lastTabDisplayedId ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                                        </PrimaryButton>
                                    </div>
                                </div>
                        </StartInvestigationDateVariablesProvider>
                    </ClinicalDetailsDataContextProvider>
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
