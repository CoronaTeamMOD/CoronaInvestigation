import { useSelector } from 'react-redux';
import { useState, useRef, RefObject, useEffect } from 'react';

import TabId from 'models/enums/TabId';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

const exportToMabarTabs = [TabId.CONTACTS_QUESTIONING];
const validTabsBeforeExport = [TabId.PERSONAL_INFO, TabId.CLINICAL_DETAILS, TabId.EXPOSURES]

const useTabManagement = () => {

    const { alertError } = useCustomSwal();

    const [currentTab, setCurrentTab] = useState<number>(0);
    const nextTab: RefObject<number> = useRef<number>(0);
    const epidemiologyNumber = useSelector<StoreStateType, number>(store => store.investigation.epidemiologyNumber);
    const currentInvestigationValidations = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);
    
    useEffect(() => {
        if (currentInvestigationValidations !== undefined) {
            const areTabsNotValid: boolean = validTabsBeforeExport.some(tabId => !currentInvestigationValidations[tabId]);
            if (exportToMabarTabs.includes(nextTab.current as number)) {
                if (areTabsNotValid) {
                    alertError('חלק מן השדות אינם תקינים, נא מלא אותם מחדש ונסה שוב.', {
                        text: 'שים לב שלא עברת בחלק מהטאבים'
                    });
                    setNextTab(currentTab);
                } else {
                    setCurrentTab(nextTab.current as number);
                }
            } else {
                setCurrentTab(nextTab.current as number);
            }
        }
    }, [currentInvestigationValidations])

    const setNextTab = (nextTabId: number) => {
        //@ts-ignore
        nextTab.current = nextTabId;
    }

    return {
        currentTab,
        setCurrentTab,
        setNextTab
    }
}

export default useTabManagement;