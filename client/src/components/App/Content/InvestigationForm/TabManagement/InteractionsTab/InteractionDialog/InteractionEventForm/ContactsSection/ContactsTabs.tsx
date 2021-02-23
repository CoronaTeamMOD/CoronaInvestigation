import React from 'react';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Tab, Tabs, useTheme } from '@material-ui/core';
import { GroupOutlined, CallMerge, AccountBalance } from '@material-ui/icons';

import useFormStyles from 'styles/formStyles';

import Forms from './Forms';
import useStyles from './ContactsTabsStyles';

const mutualContactsLabel = 'הוספת מגע ידנית';
const familyMembersLabel = 'בני משפחה';
const groupedInvestigationsLabel = 'חקירות מקובצות';
const contactBankLabel = 'בנק מגעים';

const ContactsTabs = (props : Props) => {
    const {isVisible} = props;

    const [currentTab, setTab] = React.useState<number>(0);
    const formClasses = useFormStyles();
    const classes = useStyles();

    const { palette: { action: { active } } } = useTheme();
    const tabClasses = { wrapper: classes.tab, selected: classes.selected, labelIcon: classes.labelIcon };

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    return (
        <div className={isVisible ? classes.tabs : formClasses.hidden}>
            <Tabs
                classes={{ indicator: classes.tabIndicator, root: classes.tabsSidebar }}
                indicatorColor='primary'
                orientation='vertical'
                value={currentTab}
                onChange={handleChange}
            >
                <Tab classes={tabClasses} icon={<FontAwesomeIcon color={active} icon={faUserEdit} />} label={mutualContactsLabel} />
                <Tab classes={tabClasses} icon={<GroupOutlined color='action' />} label={familyMembersLabel} />
                <Tab classes={tabClasses} icon={<CallMerge color='action' />} label={groupedInvestigationsLabel} />
                <Tab classes={tabClasses} icon={<AccountBalance color='action' />} label={contactBankLabel} />
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true} />
            <Forms
                currentTab={currentTab}
            />
        </div>
    );
};

interface Props {
    isVisible: boolean; 
}

export default ContactsTabs;
