import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';

import { Tab as TabObj } from 'models/Tab';
import TabNames from 'models/enums/TabNames';
import StoreStateType from 'redux/storeStateType';
import { setFormState } from 'redux/Form/formActionCreators';

import useStyles from './TabManagementStyles';
import PersonalInfoTab from './PersonalInfoTab/PersonalInfoTab';
import ClinicalDetails from './ClinicalDetails/ClinicalDetails';
import InteractionsTab from './InteractionsTab/InteractionsTab';
import ContactQuestioning from './ContactQuestioning/ContactQuestioning';
import ExposuresAndFlights from './ExposuresAndFlights/ExposuresAndFlights';

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {

    const {
        currentTab,
        moveToNextTab,
        setNextTab,
        areThereContacts,
        setAreThereContacts
    } = tabManagementProps;

    const lastTabId = 4;

    const tabs: TabObj[] = [
        {
            id: 0,
            name: TabNames.PERSONAL_INFO,
            displayComponent: <PersonalInfoTab id={0} onSubmit={moveToNextTab}/>
        },
        {
            id: 1,
            name: TabNames.CLINICAL_DETAILS,
            displayComponent: <ClinicalDetails id={1} onSubmit={moveToNextTab}/>
        },
        {
            id: 2,
            name: TabNames.EXPOSURES_AND_FLIGHTS,
            displayComponent: <ExposuresAndFlights id={2} onSubmit={moveToNextTab}/>
        },
        {
            id: 3,
            name: TabNames.INTERACTIONS,
            displayComponent: <InteractionsTab id={3} onSubmit={moveToNextTab} setAreThereContacts={setAreThereContacts}/>
        },
        {
            id: lastTabId,
            name: TabNames.CONTACT_QUESTIONING,
            displayComponent: <ContactQuestioning id={4} onSubmit={moveToNextTab}/>
        }
    ];

    const classes = useStyles({});

    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
            },
            wrapper: {
                flexDirection: 'row-reverse',
            }
        }),
    )(Tab);

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const formsValidations = useSelector<StoreStateType, any>((state) => state.formsValidations[investigationId]);

    const isTabValid = (tabId: number) => {
        return formsValidations !== undefined && formsValidations[tabId] !== null && !formsValidations[tabId];
    }
    
    useEffect(() => {
        !areThereContacts && setFormState(investigationId, lastTabId, true);
    }, [areThereContacts]);

    return (
        <Card className={classes.card}>
            <Tabs
                value={currentTab}
                indicatorColor='primary'
                textColor='primary'
            >
                {
                    tabs.map((tab: TabObj) =>
                        !(tab.id === lastTabId && !areThereContacts) &&
                        <StyledTab
                            // @ts-ignore
                            type='submit'
                            form={`form-${currentTab}`}
                            onClick={() => { setNextTab(tab.id) }}
                            key={tab.id}
                            label={tab.name}
                            icon={isTabValid(tab.id) ? <ErrorOutlineIcon /> : undefined}
                            className={isTabValid(tab.id) ? classes.errorIcon : undefined}
                        />
                    )
                }
            </Tabs>
            <div className={classes.displayedTab}>
                {tabs[currentTab].displayComponent}
            </div>
        </Card>
    )
};

export default TabManagement;

interface Props {
    areThereContacts: boolean;
    currentTab: number;
    moveToNextTab: () => void;
    setNextTab: (nextTabId: number) => void;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
};
