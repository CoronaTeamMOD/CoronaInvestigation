import React from 'react';
import { mount } from 'enzyme';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AdminLandingPage/mockSelectors';

import AdminLandingPage from './adminLandingPage';

describe('<AdminLandingPage />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockRouter>
            <MockThemeProvider>
                <AdminLandingPage />
            </MockThemeProvider>
        </MockRouter>
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
