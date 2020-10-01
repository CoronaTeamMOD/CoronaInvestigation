import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';

import axios from 'Utils/axios';
import { Tab as TabObj } from 'models/Tab';
import TabNames from 'models/enums/TabNames';

import useStyles from './TabManagementStyles';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import ContactQuestioning from './ContactQuestioning/ContactQuestioning';
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
    {
        id: 4,
        name: TabNames.CONTACT_QUESTIONING,
        isDisabled: false,
        displayComponent: <ContactQuestioning/>
    },
];

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {
    const { currentTab, setCurrentTab, onTabClicked, shouldDisableChangeTab } = tabManagementProps;
    const classes = useStyles({});

    const [areThereContacts, setAreThereContacts] = React.useState<boolean>(false);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    React.useEffect(() => {
        initializeTabShow();
    }, []);

    const initializeTabShow = () => {
        axios.get('/contactedPeople/' + epidemiologyNumber).then((result: any) => {
            setAreThereContacts(result?.data?.data?.allContactedPeople?.nodes?.length > 0);
        });
    };
    
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
                onChange={(event, selectedTab) => !shouldDisableChangeTab && handleTabChange(event, selectedTab)}
            >
                {
                    tabs.map((tab) => (
                        !(tab.name === TabNames.CONTACT_QUESTIONING && !areThereContacts) &&
                            <StyledTab
                                onClick={onTabClicked}
                                key={tab.id}
                                label={tab.name}
                                disabled={tab.isDisabled}
                            />
                    ))
                }
            </Tabs>
            {
                <div key={currentTab.id} className={classes.displayedTab}>
                    {currentTab.displayComponent}
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
