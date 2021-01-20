import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Desk from 'models/Desk';
import StoreStateType from 'redux/storeStateType';

const useDesksUtils = () => {

    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
    const desks = useSelector<StoreStateType, Desk[]>(state => state.desk);
    const countyDesks = useMemo(() => desks.filter(desk => desk.county === displayedCounty), [desks, displayedCounty]);
    
    return {
        displayedCounty,
        countyDesks
    }

};

export default useDesksUtils;