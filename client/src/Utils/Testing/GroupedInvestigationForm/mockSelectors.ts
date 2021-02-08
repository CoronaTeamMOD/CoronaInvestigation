import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

const mockSelectors = (investigations?: ConnectedInvestigationContact) => {
    const storeState = investigations
        ? {
              groupedInvestigations: {
                  investigations,
              },
              investigation: {
                  investigatedPatient: {},
                  endTime: null,
              },
          }
        : {
              investigation: {
                  investigatedPatient: {},
                  endTime: null,
              },
          };
    const mockStore = configureMockStore()(storeState);
    jest.spyOn(redux, 'useSelector').mockImplementation((state) => state(mockStore.getState()));
};

export default mockSelectors;
