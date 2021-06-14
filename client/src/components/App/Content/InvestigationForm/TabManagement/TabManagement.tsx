import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import React, { useEffect, useRef } from 'react';
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
import { ArrowLeft, ChevronLeft, ChevronRight } from '@material-ui/icons';

const END_INVESTIGATION = 'סיום חקירה';
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
        isLastTabDisplayed,
        isViewMode
    } = tabManagementProps;

    const tabs: TabObj[] = [
        {
            id: TabId.PERSONAL_INFO,
            name: orderedTabsNames[0],
            displayComponent: <PersonalInfoTab id={0} isViewMode={isViewMode} />
        },
        {
            id: TabId.CLINICAL_DETAILS,
            name: orderedTabsNames[1],
            displayComponent: <ClinicalDetails id={1} isViewMode={isViewMode} />
        },
        {
            id: TabId.EXPOSURES,
            name: orderedTabsNames[2],
            displayComponent: <ExposuresAndFlights id={2} isViewMode={isViewMode} />
        },
        {
            id: TabId.INTERACTIONS,
            name: orderedTabsNames[3],
            displayComponent: <InteractionsTab id={3} setAreThereContacts={setAreThereContacts} isViewMode={isViewMode} />
        },
        {
            id: TabId.CONTACTS_QUESTIONING,
            name: orderedTabsNames[4],
            displayComponent: <ContactQuestioning id={4} isViewMode={isViewMode} />
        },
    ];

    const classes = useStyles({});

    const tabRef = useRef<HTMLDivElement>(null);

    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
                padding: '20px'
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
        localStorage.setItem('isScriptOpened', String(isScriptOpened));
    }, [isScriptOpened]);

    useEffect(() => {
        tabRef.current?.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        window.scrollTo(0, 0);
    }, [currentTab]);

    return (
        <Card className={currentCardsClass}>
            <Grid container>
                <Grid item sm={8}>
                    <Tabs
                        value={currentTab}
                        classes={{
                            root: classes.tabRoot,
                            indicator: classes.indicator,
                        }}
                        textColor='primary'
                        className={classes.tabs}
                        variant='scrollable'
                        scrollButtons={isScriptOpened ? 'on' : 'off'}
                    >
                        {
                            tabs.map((tab: TabObj, index: number) =>
                                !(tab.id === TabId.CONTACTS_QUESTIONING && !areThereContacts) &&
                                <StyledTab
                                    // @ts-ignore
                                    type='submit'
                                    form={`form-${currentTab}`}
                                    onClick={() => { setNextTab(tab.id) }}
                                    key={index}
                                    label={tab.name}
                                    icon={isTabValid(tab.id) ? <ErrorOutlineIcon className={classes.icon} fontSize={'small'} /> : undefined}
                                    className={isTabValid(tab.id) ? classes.errorIcon : undefined}
                                />
                            )
                        }
                    </Tabs>
                </Grid>
                <Grid container item spacing={2} alignItems='center' sm={4}>
                    <Grid item className={classes.nextButton}>
                        {(!isViewMode || !isLastTabDisplayed) && (
                            <>
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
                            </>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            <div className={classes.displayedTab} ref={tabRef}>
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
    isViewMode: boolean;
};