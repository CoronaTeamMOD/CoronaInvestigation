import { useState, useRef, RefObject } from 'react';

const useTabManagement = () => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    const nextTab: RefObject<number> = useRef<number>(0);

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