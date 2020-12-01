import React from 'react';
import {Divider, Tab, Tabs, Collapse, useTheme} from '@material-ui/core';
import {GroupOutlined} from '@material-ui/icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ContactsTabsStyles';

const contactFormTabs = [
    {id: 0, Component: < ManualContactsForm/>},
    {id: 1, Component: <React.Fragment/>},
];

const FormComponent = ({currentTab}: {currentTab: number;}) => {
    const classes = useStyles();
    const formClasses = useFormStyles();

    return <>
        {contactFormTabs.map(tab =>
            <Collapse classes={{container: classes.collapse, hidden: formClasses.hidden}} in={currentTab === tab.id}>
                {tab.Component}
            </Collapse>
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
            <Tabs classes={{indicator: classes.tabIndicator}}
                indicatorColor='primary'
                orientation='vertical'
                value={currentTab}
                onChange={handleChange}
            >
                <Tab classes={tabClasses}
                     icon={<FontAwesomeIcon color={active} icon={faUserEdit}/>}
                     label='הוספת מגע ידנית'/>
                <Divider light={true}/>
                <Tab classes={tabClasses}
                     icon={<GroupOutlined color='action'/>}
                     label='בני משפחה'/>
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true}/>
            <FormComponent currentTab={currentTab}/>
        </div>
    );
};

export default ContactsTabs;