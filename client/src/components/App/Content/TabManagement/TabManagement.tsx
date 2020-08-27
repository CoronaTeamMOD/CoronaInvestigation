import React from 'react';
import { Paper, Tabs, Tab, Card } from '@material-ui/core';

import useStyles from './TabManagementStyles';
import TabObj from '../../../../models/TabObj';

const TabManagement: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    
    const defaultTab: TabObj = {
        id: 0,
        name: 'פרטים אישיים'
    }

    const [currentTab, setCurrentTab] = React.useState<TabObj>(defaultTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setCurrentTab({
        id: selectedTab,
        name: tabs[selectedTab].name
    });
  };

    const tabs: TabObj[] = [
        {
            id: 0,
            name: 'פרטים אישיים'
        },
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
        <Card className={classes.card} dir='rtl'>
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
    )
};

export default TabManagement;
