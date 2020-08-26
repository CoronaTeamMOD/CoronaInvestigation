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

  const tabNames = ['פרטים אישיים', 'בידוד ופרטים קליינים', 'חשיפה אפשרית וחו"ל', 'מקומות ומגעים'];
  
    return (
        <Card className={classes.card} dir='rtl'>
            <Paper>
                <Tabs
                    value={currentTab}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={handleTabChange}
                >
                    {
                        tabNames.map((tab) => {
                            return <Tab label={tab} />
                        })
                    }
                </Tabs>
            </Paper>
        </Card>
    )
}

export default TabManagement;
