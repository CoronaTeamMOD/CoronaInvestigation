import { useState } from 'react';

const useTabManagement = () => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    let nextTab: any;

    const moveToNextTab = () => {
            if(nextTab !== undefined) {
                setCurrentTab(nextTab);
            }
    }

    const setNextTab = (nextTabId: number) => {
        nextTab = nextTabId;
    }

    return {
        currentTab,
        moveToNextTab,
        setCurrentTab,
        setNextTab
    }
}

export default useTabManagement;