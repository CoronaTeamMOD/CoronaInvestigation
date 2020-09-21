import React from 'react';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { Tab as TabObj } from 'models/Tab';
import TabNames from 'models/enums/TabNames';

import useStyles from './TabManagementStyles';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import ExposuresAndFlights from './ExposuresAndFlights/ExposuresAndFlights';
import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';

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
        name: TabNames.CLINICAL_DETAILS,
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
    const { currentTab, setCurrentTab, onTabClicked, shouldDisableChangeTab } = tabManagementProps;
    const classes = useStyles({});
    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
            },
            wrapper: {
                flexDirection: "row-reverse",
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

  const formsValidations : (boolean | null)[] = useSelector<StoreStateType, (boolean | null)[]>((state) => state.formsValidations);

    return (
        <Card className={classes.card}>
                <Tabs
                    value={currentTab.id}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={(event, selectedTab) => !shouldDisableChangeTab && handleTabChange(event, selectedTab)}
                >
                    {
                        tabs.map((tab) => {
                            if (!formsValidations[tab.id] && formsValidations[tab.id] !== null) {
                            return (
                               <StyledTab className={classes.errorIcon} onClick={onTabClicked} key={tab.id} label={tab.name} disabled={tab.isDisabled} icon={<ErrorOutlineIcon/>}/>
                            )} 
                            else
                            {return (
                                <StyledTab onClick={onTabClicked} key={tab.id} label={tab.name} disabled={tab.isDisabled} />
                             )}
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
