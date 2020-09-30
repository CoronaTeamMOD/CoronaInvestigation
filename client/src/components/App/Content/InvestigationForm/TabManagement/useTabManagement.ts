import { useState } from 'react';

const useTabManagement = () => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    let nextTab: any;

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