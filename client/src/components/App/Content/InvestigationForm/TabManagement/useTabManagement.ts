import { useSelector } from 'react-redux';
import { useState, useRef, RefObject, useEffect } from 'react';

import StoreStateType from 'redux/storeStateType';
import TabId from 'models/enums/TabId';
import TabNames from 'models/enums/TabNames';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

import useInvestigationForm from '../useInvestigationForm'

export const orderedTabsNames : string[] = [TabNames.PERSONAL_INFO, TabNames.CLINICAL_DETAILS, TabNames.EXPOSURES_AND_FLIGHTS, TabNames.INTERACTIONS, TabNames.CONTACT_QUESTIONING];
const exportToMabarTabs = [TabId.CONTACTS_QUESTIONING];
const validTabsBeforeExport = [TabId.PERSONAL_INFO, TabId.CLINICAL_DETAILS, TabId.EXPOSURES]
const LAST_TAB_ID = 4;

const useTabManagement = () => {

    const { alertError } = useCustomSwal();
    const { confirmFinishInvestigation, areThereContacts } = useInvestigationForm();

    const lastTabDisplayedId = areThereContacts ? LAST_TAB_ID : LAST_TAB_ID - 1;

    const [currentTab, setCurrentTab] = useState<number>(0);
    const nextTab: RefObject<number> = useRef<number>(0);
    const epidemiologyNumber = useSelector<StoreStateType, number>(store => store.investigation.epidemiologyNumber);
    const tabsValidations = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);

    useEffect(() => {
        if (tabsValidations !== undefined) {
            const areTabsNotValid: boolean = validTabsBeforeExport.some(tabId => !tabsValidations[tabId]);
            if (exportToMabarTabs.includes(nextTab.current as number) && areTabsNotValid) {
                alertError('חלק מן השדות אינם תקינים, נא מלא אותם מחדש ונסה שוב.', {
                    text: 'שים לב שלא עברת בחלק מהטאבים'
                });
                setNextTab(currentTab);
            } else {
                if(nextTab.current === lastTabDisplayedId + 1) {
                    if(isInvestigationValid()) {
                        confirmFinishInvestigation(epidemiologyNumber);
                    } else {
                        const displayedForms = [...tabsValidations];
                        !areThereContacts && displayedForms.splice(orderedTabsNames.findIndex(tabName => tabName === TabNames.CONTACT_QUESTIONING), 1);
                        const didAnyTabsWasntChecked = displayedForms.some(form => form === null);
                        alertError('חלק מן השדות אינם תקניים, נא מלא אותם מחדש ונסה שוב.', {
                            text: didAnyTabsWasntChecked ? 'שים לב שלא עברת בחלק מהטאבים' : '',
                        })
                    }
                } else {
                    setCurrentTab(nextTab.current as number);
                }
            }
        }
    }, [tabsValidations])

    const setNextTab = (nextTabId: number) => {
        //@ts-ignore
        nextTab.current = nextTabId;
    }

    const isInvestigationValid = () => {
        return !(tabsValidations.slice(0, lastTabDisplayedId + 1).some((tabValidation) => !tabValidation));
    }

    return {
        currentTab,
        setCurrentTab,
        setNextTab,
        lastTabDisplayedId
    }
}

export default useTabManagement;