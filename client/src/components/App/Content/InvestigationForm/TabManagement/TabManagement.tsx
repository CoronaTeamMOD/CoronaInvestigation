import React from 'react';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';

import { Tab as TabObj } from 'models/Tab';
import TabNames from 'models/enums/TabNames';

import useStyles from './TabManagementStyles';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import ExposuresAndFlights from './ExposuresAndFlights/ExposuresAndFlights';

export const defaultTab: TabObj = {
    id: 0,
    name: TabNames.PERSONAL_INFO,
    isDisabled: false,
    displayComponent: <PersonalInfoTab />
};

export const tabs: TabObj[] = [
    defaultTab,
    {
        id: 1,
        name: TabNames.CLINICAL_DETAINS,
        isDisabled: false,
        displayComponent: <ClinicalDetails />
    },
    {
        id: 2,
        name: TabNames.EXPOSURES_AND_FLIGHTS,
        isDisabled: false,
        displayComponent: <ExposuresAndFlights/>,
    },
    {
        id: 3,
        name: TabNames.INTERACTIONS, 
        isDisabled: false,
        displayComponent: <InteractionsTab/>,
    },
];

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {
    const { currentTab, setCurrentTab } = tabManagementProps;
    const classes = useStyles({});
    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
            },
        }),
    )(Tab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setCurrentTab({
        id: selectedTab,
        name: tabs[selectedTab].name, 
        displayComponent: tabs[selectedTab].displayComponent,
        isDisabled: false,
    });
  };

    return (
        <Card className={classes.card}>
                <Tabs
                    value={currentTab.id}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={handleTabChange}
                >
                    {
                        tabs.map((tab) => {
                            return <StyledTab key={tab.id} label={tab.name} disabled={tab.isDisabled}/>
                        })
                    }
                </Tabs>
            {
                tabs.map((tab) => (
                    <div key={tab.id} className={classes.displayedTab} hidden={tab.id !== currentTab.id}>
                        {tab.displayComponent}
                    </div>
                ))
            }
        </Card>
    )
};

export default TabManagement;

interface Props {
    currentTab: TabObj;
    setCurrentTab: (currentTab: TabObj) => void;
};
