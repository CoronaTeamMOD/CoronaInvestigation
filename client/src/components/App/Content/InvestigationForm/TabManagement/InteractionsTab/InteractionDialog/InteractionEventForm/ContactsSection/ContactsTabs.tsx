import React from 'react';
import { GroupOutlined } from '@material-ui/icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Tab, Tabs, Collapse, TabTypeMap } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

import useStyles from './ContactsTabsStyles';
import FamilyMembers from './FamilyMembers/FamilyMembers';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';

enum contactFormTabs {
    manualContactsForm = 0,
    familyMembers = 1,
}

const FormComponent = ({ currentTab }: { currentTab: number }) => {
    return <>
        <Collapse in={currentTab === contactFormTabs.manualContactsForm}>
            <ManualContactsForm />
        </Collapse>
        <Collapse in={currentTab === contactFormTabs.familyMembers}>
            <FamilyMembers />
        </Collapse>
    </>
};

const ContactsTabs = ({isVisible}: {isVisible: boolean}) => {
    const [currentTab, setTab] = React.useState<contactFormTabs>(0);
    const formClasses = useFormStyles();
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    const getTabTextColor = (tabId: contactFormTabs): TabTypeMap['props']['textColor'] =>
        currentTab === tabId ? 'primary' : 'inherit';

    return (
        <div className={isVisible ? classes.tabs : formClasses.hidden}>
            <Tabs
                indicatorColor='primary'
                orientation='vertical'
                value={currentTab}
                onChange={handleChange}
            >
                <Tab classes={{wrapper: classes.tab}}
                     textColor={getTabTextColor(contactFormTabs.manualContactsForm)}
                     icon={<FontAwesomeIcon icon={faUserEdit}/>}
                     label='הוספת מגע ידנית'/>
                <Tab classes={{wrapper: classes.tab}}
                     textColor={getTabTextColor(contactFormTabs.familyMembers)}
                     icon={<GroupOutlined/>}
                     label='בני משפחה'/>
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true}/>
            <FormComponent currentTab={currentTab}/>
        </div>
    );
};

export default ContactsTabs;
