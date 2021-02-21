import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockSelectors = () => {
    const storeState = {
        investigation: {
            epidemiologyNumber : 555
        },
    }

    const mockStore = configureMockStore()(storeState);
    jest.spyOn(redux, 'useSelector').mockImplementation((state) => state(mockStore.getState()));
};

export default mockSelectors;