import React from 'react';
import { Tabs, Tab, Card, createStyles, withStyles } from '@material-ui/core';

import { Tab as TabObj } from 'models/Tab';
import TabNames from 'models/enums/TabNames';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';
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
        areThereContacts
    } = tabManagementProps;

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
            displayComponent: <InteractionsTab id={3} onSubmit={moveToNextTab}/>
        }
    ];

   const last = {
        id: 4,
            name: TabNames.CONTACT_QUESTIONING,
            displayComponent: <ContactQuestioning id={4} onSubmit={moveToNextTab}/>
    };

    const classes = useStyles({});
    
    const StyledTab = withStyles((theme) =>
        createStyles({
            root: {
                fontWeight: theme.typography.fontWeightRegular,
            },
            wrapper: {
                flexDirection: "row-reverse",
            }
        }),
    )(Tab);

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const formsValidations = useSelector<StoreStateType, any>((state) => state.formsValidations[investigationId]);
    
    const isTabInValid = (tabId: number) => {
        return formsValidations !== undefined && formsValidations[tabId] !== null && !formsValidations[tabId]  
    }

    return (
        <Card className={classes.card}>
                <Tabs
                    value={currentTab}
                    indicatorColor='primary'
                    textColor='primary'
                >
                     {
                        tabs.map((tab: TabObj) => 
                            <StyledTab 
                                // @ts-ignore
                                type="submit"
                                form={`form-${currentTab}`}
                                onClick={() => {setNextTab(tab.id)}}
                                key={tab.id}
                                label={tab.name}
                                icon={isTabInValid(tab.id) ? <ErrorOutlineIcon/> : undefined}
                                className={isTabInValid(tab.id) ? classes.errorIcon : undefined}
                            />
                    )}
                    {areThereContacts && <StyledTab 
                                // @ts-ignore
                                type="submit"
                                form={`form-${currentTab}`}
                                onClick={() => {setNextTab(last.id)}}
                                key={last.id}
                                label={last.name}
                                icon={isTabInValid(last.id) ? <ErrorOutlineIcon/> : undefined}
                                className={isTabInValid(last.id) ? classes.errorIcon : undefined}
                            />
                    }
                </Tabs>
                <div className={classes.displayedTab}>
                    {currentTab == 4 ? last.displayComponent:tabs[currentTab].displayComponent}
                </div>
        </Card>
    )
};

export default TabManagement;

interface Props {
    areThereContacts: boolean,
    currentTab: number,
    moveToNextTab: () => void,
    setNextTab: (nextTabId: number) => void
};
