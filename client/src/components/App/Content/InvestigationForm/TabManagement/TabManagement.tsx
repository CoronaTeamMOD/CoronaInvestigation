import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';

import TabId from 'models/enums/TabId';
import { Tab as TabObj } from 'models/Tab';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TabManagementStyles';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import ContactQuestioning from './ContactQuestioning/ContactQuestioning';
import ExposuresAndFlights from './ExposuresAndFlights/ExposuresAndFlights';
import { orderedTabsNames } from './useTabManagement'

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {

    const {
        currentTab,
        setNextTab,
        areThereContacts,
        setAreThereContacts
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

    return (
        <Card className={classes.card}>
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
                            icon={isTabValid(tab.id) ? <ErrorOutlineIcon /> : undefined}
                            className={isTabValid(tab.id) ? classes.errorIcon : undefined}
                        />
                    )
                }
            </Tabs>
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
};
