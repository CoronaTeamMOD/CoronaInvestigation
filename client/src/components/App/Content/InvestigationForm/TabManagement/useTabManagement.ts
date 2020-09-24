import { useState } from 'react';

const useTabManagement = () => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    let nextTab=0;
    
    const moveToNextTab = () => {
            setCurrentTab(nextTab);
    }

    const setNextTab = (num: number) => {
        nextTab = num;
    }

    return {
        currentTab,
        moveToNextTab,
        setCurrentTab,
        setNextTab
    }
}

export default useTabManagement;
