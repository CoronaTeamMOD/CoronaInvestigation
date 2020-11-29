import React from 'react';
import {Divider, Tab, Tabs, Collapse, useTheme} from '@material-ui/core';
import {GroupOutlined} from '@material-ui/icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ContactsTabsStyles';

enum contactFormTabs {
    manualContactsForm = 0,
    familyMembers = 1,
}

const FormComponent = ({currentTab}: {currentTab: number;}) => {
    const classes = useStyles();

    return <>
        <Collapse classes={{container: classes.collapse}}
                  in={currentTab === contactFormTabs.manualContactsForm}>
            <ManualContactsForm/>
        </Collapse>
    </>
};

const ContactsTabs = ({isVisible}: {isVisible: boolean}) => {
    const [currentTab, setTab] = React.useState<contactFormTabs>(0);
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