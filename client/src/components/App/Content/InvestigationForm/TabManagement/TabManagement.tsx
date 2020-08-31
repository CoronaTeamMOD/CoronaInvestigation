import React from 'react';
import {Paper, Tabs, Tab, Card, createStyles, withStyles} from '@material-ui/core';

import { Tab as TabObj } from 'models/Tab';
import useStyles from './TabManagementStyles';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים',
    isDisabled: false,
    displayComponent: <></>
};

export const tabs: TabObj[] = [
    defaultTab,
    {
        id: 1,
        name: 'בידוד ופרטים קליניים',
        isDisabled: false,
        displayComponent: <ClinicalDetails />
    },
    {
        id: 2,
        name: 'חשיפה אפשרית וחו"ל',
        isDisabled: false,
        displayComponent: <></>
    },
    {
        id: 3,
        name: 'מקומות ומגעים',
        isDisabled: false,
        displayComponent: <></>
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
      // TODO: isDisabled needs to be changed to false when all the mandatory fields are filled
        setCurrentTab(tabs[selectedTab]);
    };

    return (
        <Card className={classes.card}>
            <Paper>
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
            </Paper>
            {
                tabs.map((tab) => (
                    <Paper key={tab.id} className={classes.displyedTab} hidden={tab.id !== currentTab.id}>
                        {tab.displayComponent}
                    </Paper>
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
