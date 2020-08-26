import React from 'react';
import { Paper, Tabs, Tab, Card } from '@material-ui/core';

import useStyles from './TabManagementStyles';

const TabManagement: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const defaultTab = 0;

    const [currentTab, setCurrentTab] = React.useState(defaultTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setCurrentTab(selectedTab);
  };
  
    return (
        <Card className={classes.card}>
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
        </Card>
    )
}

export default TabManagement;
