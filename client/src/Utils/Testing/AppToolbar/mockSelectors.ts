import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { user, county } from './state';

const mockSelectors = (userType : number) => {
    const storeState = {
        user : user(userType),
        county
    }
    const mockStore = configureMockStore()(storeState);
    jest.spyOn(redux, 'useSelector').mockImplementation((state) => state(mockStore.getState()));
};

export default mockSelectors;