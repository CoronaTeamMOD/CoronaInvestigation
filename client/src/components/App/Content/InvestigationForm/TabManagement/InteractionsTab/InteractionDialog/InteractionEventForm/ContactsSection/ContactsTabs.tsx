import React from 'react';
import { GroupOutlined, CallMerge } from '@material-ui/icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Tab, Tabs, useTheme } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

import Forms from './Forms';
import useStyles from './ContactsTabsStyles';

const ContactsTabs = ({ isVisible }: { isVisible: boolean }) => {
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
                <Tab classes={tabClasses}
                    icon={<FontAwesomeIcon color={active} icon={faUserEdit} />}
                    label='הוספת מגע ידנית' />
                <Tab
                    classes={tabClasses}
                    icon={<GroupOutlined color='action' />}
                    label='בני משפחה' />
                <Tab
                    classes={tabClasses}
                    icon={<CallMerge color='action' />}
                    label='חקירות מקובצות' />
            </Tabs>
            <Divider orientation='vertical' variant='fullWidth' light={true} />
            <Forms currentTab={currentTab} />
        </div>
    );
};

export default ContactsTabs;
