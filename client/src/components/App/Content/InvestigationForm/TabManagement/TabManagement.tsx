import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Tabs, Tab, Card, createStyles, withStyles, Grid, Button, IconButton, Tooltip } from '@material-ui/core';

import TabId from 'models/enums/TabId';
import { Tab as TabObj } from 'models/Tab';
import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './TabManagementStyles';
import { orderedTabsNames } from './useTabManagement';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ContactQuestioning from './ContactQuestioning/ContactQuestioning';
import ExposuresAndFlights from './ExposuresAndFlights/ExposuresAndFlights';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';
const SHOW_SCRIPT = 'הצג תסריט';
const HIDE_SCRIPT = 'הסתר תסריט';

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {

    const {
        currentTab,
        setNextTab,
        areThereContacts,
        setAreThereContacts,
        isScriptOpened,
        setIsScriptOpened,
        isLastTabDisplayed
    } = tabManagementProps;

    const tabs: TabObj[] = [
        {
            id: TabId.PERSONAL_INFO,
            name: orderedTabsNames[0],
            displayComponent: <PersonalInfoTab id={0}/>
        },
        {
            id: TabId.CLINICAL_DETAILS,
            name: orderedTabsNames[1],
            displayComponent: <ClinicalDetails id={1}/>
        },
        {
            id: TabId.EXPOSURES,
            name: orderedTabsNames[2],
            displayComponent: <ExposuresAndFlights id={2}/>
        },
        {
            id: TabId.INTERACTIONS,
            name: orderedTabsNames[3],
            displayComponent: <InteractionsTab id={3} setAreThereContacts={setAreThereContacts}/>
        },
        {
            id: TabId.CONTACTS_QUESTIONING,
            name: orderedTabsNames[4],
            displayComponent: <ContactQuestioning id={4} />
        },
    ];

    const classes = useStyles({});

    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
                minHeight: '7vh'
            },
            wrapper: {
                flexDirection: 'row-reverse',
            }
        }),
    )(Tab);

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const formsValidations = useSelector<StoreStateType, any>((state) => state.formsValidations[investigationId]);

    const isTabValid = (tabId: number) => {
        return formsValidations !== undefined && formsValidations[tabId] !== null && !formsValidations[tabId];
    }
    
    const currentCardsClass = `${classes.card} ${isScriptOpened ? classes.collapsed : ''}`;

    useEffect(() => {
        localStorage.setItem('isScriptOpened' , String(isScriptOpened));
    }, [isScriptOpened])

    return (
        <Card className={currentCardsClass}>
            <Grid container>
                <Grid item sm={8}>
                    <Tabs
                        value={currentTab}
                        indicatorColor='primary'
                        textColor='primary'
                    >
                        {
                            tabs.map((tab: TabObj) =>
                            !(tab.id === TabId.CONTACTS_QUESTIONING && !areThereContacts) &&
                            <StyledTab
                                    // @ts-ignore
                                    type='submit'
                                    form={`form-${currentTab}`}
                                    onClick={() => { setNextTab(tab.id) }}
                                    key={tab.id}
                                    label={tab.name}
                                    icon={isTabValid(tab.id) ? <ErrorOutlineIcon className={classes.icon} fontSize={'small'}/> : undefined}
                                    className={isTabValid(tab.id) ? classes.errorIcon : undefined}
                                />
                            )
                        }
                    </Tabs>
                </Grid>
                <Grid container item spacing={2} alignItems='center' sm={4}>
                    <Grid item className={classes.nextButton}>
                        <PrimaryButton
                            type='submit'
                            form={`form-${currentTab}`}
                            test-id={isLastTabDisplayed ? 'endInvestigation' : 'continueToNextStage'}
                            onClick={() => setNextTab(currentTab + 1)}                                    
                        >
                            {isLastTabDisplayed ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                        </PrimaryButton>
                        <Tooltip title={isScriptOpened ? HIDE_SCRIPT : SHOW_SCRIPT} arrow placement='top'>
                            <IconButton
                                onClick={() => setIsScriptOpened(!isScriptOpened)}
                            >
                                {
                                    isScriptOpened 
                                        ? <ChevronLeft />
                                        : <ChevronRight /> 
                                }
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            
            <div className={classes.displayedTab}>
                {tabs[currentTab].displayComponent}
            </div>
        </Card>
    )
};

export default TabManagement;

interface Props {
    areThereContacts: boolean;
    currentTab: number;
    setNextTab: (nextTabId: number) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
    isScriptOpened: boolean;
    setIsScriptOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLastTabDisplayed: boolean;
};
