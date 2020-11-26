import React, { useContext } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Divider, Tab, Tabs, Collapse} from '@material-ui/core';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useFormStyles from 'styles/formStyles';
import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';

import ContactsForms from './ContactsForms/ContactsForms';
import FamilyContactsTable from '../../FamilyContactsDialog/FamilyContactsTable/FamilyContactsTable';

enum contactFormTabs {
    manualContactsForm = 0,
    familyMembers = 1,
};

const useStyles = makeStyles({
    tabs: {
        display: 'flex'
    }
});

const FormComponent = ({currentTab}: {currentTab: number;}) => {
    const { familyMembers } = useContext(familyMembersContext);
    return <>
        <Collapse in={currentTab === contactFormTabs.manualContactsForm}>
            <ContactsForms/>
        </Collapse>
        <Collapse in={currentTab === contactFormTabs.familyMembers}>
            <FamilyContactsTable
                familyMembers={familyMembers}
            />
        </Collapse>
    </>
};

const ContactsTabs = ({isVisible}: {isVisible: boolean}) => {
    const [currentTab, setTab] = React.useState<number>(0);
    const formClasses = useFormStyles();
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    return (
        <div className={isVisible ? classes.tabs : formClasses.hidden}>
            <Tabs
                indicatorColor='primary'
                orientation='vertical'
                value={currentTab}
                onChange={handleChange}
            >

                <Tab icon={<FontAwesomeIcon icon={faUserEdit} />} label='הוספת מגע ידנית'/>
                <Tab icon={<FontAwesomeIcon icon={faUserEdit} />} label='בני משפחה'/>
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true}/>
            <FormComponent currentTab={currentTab}/>
        </div>
    );
};

export default ContactsTabs;
