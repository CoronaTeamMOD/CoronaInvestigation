import React from 'react';
import { mount } from 'enzyme';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AdminLandingPage/mockSelectors';
import { testCountyName } from 'Utils/Testing/AdminLandingPage/state/user';

import AdminLandingPage from './adminLandingPage';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import LastUpdateMessage from './LastUpdateMessage/LastUpdateMessage';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import TimeRangeFilterCard from './TimeRangeFilterCard/TimeRangeFilterCard';

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

    it('shows correct napa', () => {
        const countyName = wrapper.find('p#county-name');

        expect(countyName.exists()).toBeTruthy();
        expect(countyName).toHaveLength(1);
        expect(countyName.text()).toBe(`נפת ${testCountyName}`);
    });

    it('shows LastUpdateMessage', () => {
        const lastUpdateMessage = wrapper.find(LastUpdateMessage);

        expect(lastUpdateMessage.exists()).toBeTruthy();
        expect(lastUpdateMessage).toHaveLength(1);
    });

    it('shows DesksFilterCard', () => {
        const desksFilterCard = wrapper.find(DesksFilterCard);

        expect(desksFilterCard.exists()).toBeTruthy();
        expect(desksFilterCard).toHaveLength(1);
    });

    it('shows InvestigationsInfo', () => {
        const investigationsInfo = wrapper.find(InvestigationsInfo);

        expect(investigationsInfo.exists()).toBeTruthy();
        expect(investigationsInfo).toHaveLength(1);
    });

    it('shows TimeRangeFilter card', () => {
        const timeRangeFilterCard = wrapper.find(TimeRangeFilterCard);

        expect(timeRangeFilterCard.exists()).toBeTruthy();
        expect(timeRangeFilterCard).toHaveLength(1);
    });
});
