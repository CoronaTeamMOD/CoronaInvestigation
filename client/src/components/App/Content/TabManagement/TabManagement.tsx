import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';

const TabManagement: React.FC = (): JSX.Element => {
    const defaultTab = 0;

    const [currentTab, setCurrentTab] = React.useState(defaultTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setCurrentTab(selectedTab);
  };
  
    return (
        <Paper dir='rtl'>
            <Tabs
                value={currentTab}
                indicatorColor='primary'
                textColor='primary'
                onChange={handleTabChange}
            >
                <Tab label='פרטים אישיים'/>
                <Tab label='בידוד ופרטים קליינים'/>
                <Tab label='חשיפה אפשרית וחו"ל'/>
                <Tab label='משפחה ואנשים קרובים'/>
                <Tab label='מקומות ומגעים'/>
            </Tabs>
        </Paper>
    )
}

export default TabManagement;
