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


export const tabs: TabObj[] = [
    {
        id: 0,
        name: TabNames.PERSONAL_INFO,
    },
    {
        id: 1,
        name: TabNames.CLINICAL_DETAILS,
    },
    {
        id: 2,
        name: TabNames.EXPOSURES_AND_FLIGHTS,
    },
    {
        id: 3,
        name: TabNames.INTERACTIONS, 
    },
    {
        id: 4,
        name: TabNames.CONTACT_QUESTIONING,
        //isDisabled: false,
        //displayComponent: <ContactQuestioning/>
    },
];

const TabManagement: React.FC<Props> = (tabManagementProps: Props): JSX.Element => {

    const {
        currentTab,
        moveToNextTab,
        setCurrentTab,
        setNextTab
    } = tabManagementProps;

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

    return (
        <Card className={classes.card}>
                <Tabs
                    value={currentTab}
                    indicatorColor='primary'
                    textColor='primary'
                >
                    {
                        tabs.map((tab) => {
                            if (formsValidations !== undefined && !formsValidations[tab.id] && formsValidations[tab.id] !== null) {
                                return <StyledTab 
                                // @ts-ignore
                                type="submit"
                                form={`form-${currentTab}`}
                                onClick={() => {setNextTab(tab.id)}}
                                key={tab.id}
                                label={tab.name}
                                icon={<ErrorOutlineIcon/>}
                                className={classes.errorIcon}
                            />} else {
                                    return <StyledTab 
                                        // @ts-ignore
                                        type="submit"
                                        form={`form-${currentTab}`}
                                        onClick={() => {setNextTab(tab.id)}}
                                        key={tab.id}
                                        label={tab.name}
                                    />}
                        })
                    }
                </Tabs>
            
                <div className={classes.displayedTab}>
                {currentTab == 0 && <PersonalInfoTab id={0} onSubmit={moveToNextTab}/>}
                {currentTab == 1 && <ClinicalDetails id={1} onSubmit={moveToNextTab}/>}
                {currentTab == 2 && <ExposuresAndFlights id={2} onSubmit={moveToNextTab}/>}
                {currentTab == 3 && <InteractionsTab id={3} onSubmit={moveToNextTab}/>}
                {currentTab == 4 && <ContactQuestioning id={4} onSubmit={moveToNextTab}/>}
                </div>
            
        </Card>
    )
};

export default TabManagement;

interface Props {
    currentTab?:any,
    moveToNextTab?:any,
    setCurrentTab?:any,
    setNextTab?:any
};
