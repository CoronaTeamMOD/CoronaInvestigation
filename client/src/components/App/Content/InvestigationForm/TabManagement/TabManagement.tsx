import React from 'react';
import {Paper, Tabs, Tab, Card, withStyles, createStyles} from '@material-ui/core';

import TabObj from 'models/TabObj';

import useStyles from './TabManagementStyles';
import { defaultTab } from '../InvestigationForm';

import ClinicalDetails from './ClinicalDetails/ClinicalDetails';

const TabManagement: React.FC<Props> = (props: Props): JSX.Element => {
    const { currentTab, setCurrentTab } = props;
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
        displayComponent: tabs[selectedTab].displayComponent
    });
  };

    const tabs: TabObj[] = [
        defaultTab,
        {
            id: 1,
            name: 'בידוד ופרטים קליניים', 
            displayComponent: <ClinicalDetails />
        },
        {
            id: 2,
            name: 'חשיפה אפשרית וחו"ל', 
            displayComponent: <></>
        },
        {
            id: 3,
            name: 'מקומות ומגעים', 
            displayComponent: <></>
        },
    ];
  
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
                            return <StyledTab key={tab.id} label={tab.name} />
                        })
                    }
                </Tabs>
            </Paper>
            {
                tabs.map((tab) => (
                    <Paper className={classes.displyedTab} hidden={tab.id !== currentTab.id}>
                        {tab.displayComponent}
                    </Paper>
                ))
            }
        </Card>
    )
};

export default TabManagement;

interface Props {
    currentTab: TabObj
    setCurrentTab: (currentTab: TabObj) => void;
};