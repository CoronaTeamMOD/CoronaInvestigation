import React from 'react';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { jssPreset } from '@material-ui/styles';
import { Paper, Tabs, Tab, Card, StylesProvider } from '@material-ui/core';

import TabObj from 'models/TabObj';

import useStyles from './TabManagementStyles';

const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים'
};

const jss = create({ plugins: [...jssPreset().plugins, rtl()] })

const TabManagement: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [currentTab, setCurrentTab] = React.useState<TabObj>(defaultTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setCurrentTab({
        id: selectedTab,
        name: tabs[selectedTab].name
    });
  };

    const tabs: TabObj[] = [
        defaultTab,
        {
            id: 1,
            name: 'בידוד ופרטים קליניים'
        },
        {
            id: 2,
            name: 'חשיפה אפשרית וחו"ל'
        },
        {
            id: 3,
            name: 'מקומות ומגעים'
        },
    ];
  
    return (
        <StylesProvider jss={jss}>
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
                            return <Tab label={tab.name} />
                        })
                    }
                </Tabs>
            </Paper>
        </Card>
        </StylesProvider>
    )
};

export default TabManagement;
