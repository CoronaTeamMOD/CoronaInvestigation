import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';

import mockSelectors from 'Utils/Testing/AdminLandingPage/mockSelectors';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';

import AdminLandingPage from './adminLandingPage';

describe('<AdminLandingPage />', () => {
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), replace: jest.fn() };

    jest.mock('react-router-dom' , () => ({
        useHistory: () => ({
          location : {state : '/hello'},
          push: jest.fn(),
        })
    }));

    mockSelectors();
    const wrapper = mount(
        //@ts-ignore
        <Router history={historyMock}>
            <MockThemeProvider>
                <AdminLandingPage />
            </MockThemeProvider>
        </Router>
    );

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it.todo('shows correct napa');

    it.todo('shows lastUpdateMessage');

    it.todo('shows desksFilterCard');

    it.todo('shows investigationsInfo');

    it.todo('shows TimeRangeFilter card');

    it.todo('shows Unallocated card');

    it.todo('shows Postponed card');

    it.todo('shows UnusualCard');
});
