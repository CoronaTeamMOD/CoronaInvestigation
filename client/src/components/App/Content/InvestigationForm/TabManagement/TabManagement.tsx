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
    displayComponent: <PersonalInfoTab id={0}/>
};

export const tabs: TabObj[] = [
    defaultTab,
    {
        id: 1,
        name: TabNames.CLINICAL_DETAILS,
        isDisabled: false,
        displayComponent: <ClinicalDetails id={1}/>
    },
    {
        id: 2,
        name: TabNames.EXPOSURES_AND_FLIGHTS,
        isDisabled: false,
        displayComponent: <ExposuresAndFlights id={2}/>,
    },
    {
        id: 3,
        name: TabNames.INTERACTIONS, 
        isDisabled: false,
        displayComponent: <InteractionsTab id={3}/>,
    },
];

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {
    const { currentTab, setCurrentTab, onTabClicked, shouldDisableChangeTab } = tabManagementProps;
    const classes = useStyles({});
    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
            },
        }),
    )(Tab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    console.log("changeTab");
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
                    //onChange={(event, selectedTab) => handleTabChange(event, selectedTab)}
                    onChange={()=> console.log("changeTab")}
                >
                    {
                        tabs.map((tab) => {
                            return <StyledTab 
                                        // @ts-ignore
                                        type="submit"
                                        form={`form-${currentTab.id}`}
                                        onClick={onTabClicked}
                                        key={tab.id}
                                        label={tab.name}
                                        disabled={tab.isDisabled}
                                    />
                        })
                    }
                </Tabs>
            {
                <div key={currentTab.id} className={classes.displayedTab}>
                    {currentTab.displayComponent }
                </div>
            }
        </Card>
    )
};

export default TabManagement;

interface Props {
    currentTab: TabObj;
    setCurrentTab: (currentTab: TabObj) => void;
    onTabClicked: () => void;
    shouldDisableChangeTab: boolean;
};
