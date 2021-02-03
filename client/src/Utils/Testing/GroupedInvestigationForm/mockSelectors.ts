import * as redux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

const mockSelectors = (investigations : ConnectedInvestigationContact) => {
    const mockStore = configureMockStore()({
      groupedInvestigations: {
        investigations
      },
      investigation : {
        investigatedPatient : {},
        endTime : null
      }
    });
    jest
      .spyOn(redux, 'useSelector')
      .mockImplementation(state => state(mockStore.getState()));
};


export default mockSelectors;