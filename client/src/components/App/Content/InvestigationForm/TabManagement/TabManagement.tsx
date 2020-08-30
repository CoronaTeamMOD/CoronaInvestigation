import React from 'react';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { jssPreset } from '@material-ui/styles';
import {Paper, Tabs, Tab, Card, StylesProvider, createStyles, withStyles} from '@material-ui/core';

import { Tab as TabObj } from 'models/Tab';
import useStyles from './TabManagementStyles';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים',
    isDisabled: false,
};

export const tabs: TabObj[] = [
    defaultTab,
    {
        id: 1,
        name: 'בידוד ופרטים קליניים',
        isDisabled: false,
    },
    {
        id: 2,
        name: 'חשיפה אפשרית וחו"ל',
        isDisabled: false,
    },
    {
        id: 3,
        name: 'מקומות ומגעים',
        isDisabled: false,
    },
];

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

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
                            return <StyledTab key={tab.id} label={tab.name} disabled={tab.isDisabled}/>
                        })
                    }
                </Tabs>
            </Paper>
        </Card>
        </StylesProvider>
    )
};

export default TabManagement;

interface Props {
    currentTab: TabObj;
    setCurrentTab: (currentTab: TabObj) => void;
}