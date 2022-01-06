import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import StoreStateType from 'redux/storeStateType';
import Snackbar from '@material-ui/core/Snackbar';
import { Grid, Paper, Card } from '@material-ui/core';
import { setFormState } from 'redux/Form/formActionCreators';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import {
    ExposureAndFlightsContextProvider, ExposureAndFlightsDetails,
    initialExposuresAndFlightsData, ExposureAndFlightsDetailsAndSet
} from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import TabManagement from './TabManagement/TabManagement';
import ConvesrationScript from './ConversationScript/ConvesrationScript';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import useTabManagement, { LAST_TAB_ID } from './TabManagement/useTabManagement';
import TrackingRecommendationForm from './TrackingRecommendation/TrackingRecommendationForm';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

const InvestigationForm: React.FC = (props): JSX.Element => {
    const classes = useStyles({});

    const initialSctiptState = (localStorage.getItem('isScriptOpened') ?? 'true') === 'true';

    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [exposureAndFlightsData, setExposureDataAndFlights] = React.useState<ExposureAndFlightsDetails>(initialExposuresAndFlightsData)
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<Date>();
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [endInvestigationDate, setEndInvestigationDate] = React.useState<Date>(new Date());
    const [lastTabDisplayedId, setLastTabDisplayedId] = React.useState<number>(LAST_TAB_ID - 1);
    const [isScriptOpened, setIsScriptOpened] = React.useState<boolean>(initialSctiptState);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const investigationStatusId = useSelector<StoreStateType,number>((state)=>state.investigation.investigationStatus.mainStatus);
    const isViewMode = useSelector<StoreStateType, boolean>(state => state.investigation.isViewMode);

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

    const {
        currentTab,
        setNextTab,
        areThereContacts,
        setAreThereContacts
    } = useTabManagement({ lastTabDisplayedId });

    useEffect(() => {
        setLastTabDisplayedId(areThereContacts ? LAST_TAB_ID : LAST_TAB_ID - 1);
        !areThereContacts && setFormState(investigationId, LAST_TAB_ID, true);
    }, [areThereContacts]);

    const isLastTabDisplayed = currentTab === lastTabDisplayedId;
    const shouldDisableInvestigation = isViewMode ||
        investigationStatusId === InvestigationMainStatusCodes.DONE ||
        investigationStatusId === InvestigationMainStatusCodes.NOT_INVESTIGATED ||
        investigationStatusId === InvestigationMainStatusCodes.CANT_COMPLETE;
    return (
        <div className={classes.content}>
            <ExposureAndFlightsContextProvider value={exposuresAndFlightsVariables}>
                <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                    <InvestigationInfoBar
                        currentTab={currentTab}
                        isViewMode={shouldDisableInvestigation}
                    />
                    <div className={classes.interactiveForm}>
                        <Grid container alignItems='flex-start'>
                            <TabManagement
                                areThereContacts={areThereContacts}
                                setAreThereContacts={setAreThereContacts}
                                currentTab={currentTab}
                                setNextTab={setNextTab}
                                isScriptOpened={isScriptOpened}
                                setIsScriptOpened={setIsScriptOpened}
                                isLastTabDisplayed={isLastTabDisplayed}
                                isViewMode={shouldDisableInvestigation}
                            />
                            <Grid item className={isScriptOpened ? classes.uncollapsed : classes.collapsed}>
                                <Card className={isScriptOpened ? classes.scriptWrapperWithMaxHeight : classes.scriptWrapper}>
                                    <ConvesrationScript currentTab={currentTab} />
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid container alignItems='center' className={classes.buttonSection}>
                            {isLastTabDisplayed &&
                                <Grid item>
                                    <Paper className={classes.trackingForm}>
                                        <TrackingRecommendationForm isViewMode={shouldDisableInvestigation} />
                                    </Paper>
                                </Grid>
                            }
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
