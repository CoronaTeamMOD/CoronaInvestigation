import { useSelector } from 'react-redux';
import { useState, useRef, RefObject } from 'react';

import StoreStateType from 'redux/storeStateType';

const CONTACTS_QUESTIONING_TAB_ID = 4;
const exportToMabarTabs = [CONTACTS_QUESTIONING_TAB_ID];
const useTabManagement = () => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    const nextTab: RefObject<number> = useRef<number>(0);
    const epidemiologyNumber = useSelector<StoreStateType, number>(store => store.investigation.epidemiologyNumber);
    const currentInvestigationsValidations = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);

    const moveToNextTab = () => {
        setCurrentTab(nextTab.current as number);
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