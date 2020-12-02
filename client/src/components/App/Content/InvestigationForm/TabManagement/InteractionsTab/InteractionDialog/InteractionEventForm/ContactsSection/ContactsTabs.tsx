import React from 'react';
import {GroupOutlined} from '@material-ui/icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Tab, Tabs, useTheme } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

import useStyles from './ContactsTabsStyles';
import FamilyMembersForm from './FamilyMembers/FamilyMembersForm';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';

const contactFormTabs = [
    {id: 0, Component: <ManualContactsForm />},
    {id: 1, Component: <FamilyMembersForm />},
];

const FormComponent = ({ currentTab }: { currentTab: number }) => {
    const formClasses = useFormStyles();

    return <>
        {contactFormTabs.map(tab =>
            <div className={currentTab !== tab.id ? formClasses.hidden : ''}>
                {tab.Component}
            </div>
        )}
    </>
};

const ContactsTabs = ({isVisible}: {isVisible: boolean}) => {
    const [currentTab, setTab] = React.useState<number>(0);
    const formClasses = useFormStyles();
    const classes = useStyles();

    const {palette: {action: {active}}} = useTheme();
    const tabClasses = {wrapper: classes.tab, selected: classes.selected, labelIcon: classes.icon};

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    return (
        <div className={isVisible ? classes.tabs : formClasses.hidden}>
            <Tabs
                classes={{indicator: classes.tabIndicator}}
                indicatorColor='primary'
                orientation='vertical'
                value={currentTab}
                onChange={handleChange}
            >
                <Tab classes={tabClasses}
                     icon={<FontAwesomeIcon color={active} icon={faUserEdit}/>}
                     label='הוספת מגע ידנית'/>
                <Tab
                    classes={tabClasses}
                    icon={<GroupOutlined color='action'/>}
                    label='בני משפחה'/>
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true}/>
            <FormComponent currentTab={currentTab}/>
        </div>
    );
};

export default ContactsTabs;
