import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { user, county, desk } from './state';

const mockSelectors = (userType : number) => {
    const storeState = {
        county,
        user : user(userType),
        desk,
    }
    const mockStore = configureMockStore()(storeState);
    jest.spyOn(redux, 'useSelector').mockImplementation((state) => state(mockStore.getState()));
};

export default mockSelectors;