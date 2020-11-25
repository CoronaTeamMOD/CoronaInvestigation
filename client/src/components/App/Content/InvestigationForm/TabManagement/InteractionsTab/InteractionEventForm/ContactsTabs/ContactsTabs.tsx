import React from 'react';
import {Divider, Tab, Tabs, Collapse} from '@material-ui/core';
import ContactsForms from './ContactsForms/ContactsForms';
import useFormStyles from 'styles/formStyles';
import {makeStyles} from "@material-ui/core/styles";

enum contactFormTabs {
    manualContactsForm= 0,
    familyMembers= 1,
};

const useStyles = makeStyles({
    tabs: {
        display: 'flex'
    }
});

const FormComponent = ({currentTab}: {currentTab: number;}) => {
    return <>
        <Collapse in={currentTab === contactFormTabs.manualContactsForm}>
            <ContactsForms/>
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
                <Tab label='הוספת מגע ידנית'/>
                <Tab label='בני משפחה'/>
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true}/>
            <FormComponent currentTab={currentTab}/>
        </div>
    );
};

export default ContactsTabs;