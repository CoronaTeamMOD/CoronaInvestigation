import { useSelector } from 'react-redux';
import { useState, useRef, RefObject } from 'react';

import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

import { CONTACTS_QUESTIONING_TAB_ID, PERSONAL_INFO_TAB_ID, CLINICAL_DETAILS_TAB_ID, EXPOSURES_TAB_ID } from './TabManagement';

const exportToMabarTabs = [CONTACTS_QUESTIONING_TAB_ID];
const validTabsBeforeExport = [PERSONAL_INFO_TAB_ID, CLINICAL_DETAILS_TAB_ID, EXPOSURES_TAB_ID]

const useTabManagement = () => {

    const { alertError } = useCustomSwal();

    const [currentTab, setCurrentTab] = useState<number>(0);
    const nextTab: RefObject<number> = useRef<number>(0);
    const epidemiologyNumber = useSelector<StoreStateType, number>(store => store.investigation.epidemiologyNumber);
    const currentInvestigationValidations = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);

    const moveToNextTab = () => {
        const areTabsNotValid: boolean = validTabsBeforeExport.some(tabId => !currentInvestigationValidations[tabId]);
        if (exportToMabarTabs.includes(nextTab.current as number)) {
            if (areTabsNotValid) {
                alertError('חלק מן השדות אינם תקינים, נא מלא אותם מחדש ונסה שוב.', {
                    text: 'שים לב שלא עברת בחלק מהטאבים'
                })
            } else {
                setCurrentTab(nextTab.current as number);
            }
        } else {
            setCurrentTab(nextTab.current as number);
        }
    }

    const setNextTab = (nextTabId: number) => {
        //@ts-ignore
        nextTab.current = nextTabId;
    }

    return {
        currentTab,
        moveToNextTab,
        setCurrentTab,
        setNextTab
    }
}

export default useTabManagement;