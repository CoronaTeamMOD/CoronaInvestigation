import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { user } from './state';

const mockSelectors = (userType : number) => {
    const storeState = {
        user : user(userType),
    }
    const mockStore = configureMockStore()(storeState);
    jest.spyOn(redux, 'useSelector').mockImplementation((state) => state(mockStore.getState()));
};

export default mockSelectors;