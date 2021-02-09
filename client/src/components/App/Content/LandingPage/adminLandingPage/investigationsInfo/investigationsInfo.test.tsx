import React from 'react'
import { mount } from 'enzyme';

import invesitgationInfoStatistics from 'Utils/Testing/AdminLandingPage/investigationInfoStatistics';

import InvestigationsInfo from './investigationsInfo';

const onInfoButtonClick = jest.fn();
const allInvestigationsCount = 3;
const investigationsInfoProps = {
    onInfoButtonClick,
    investigationsStatistics: invesitgationInfoStatistics,
    allInvestigationsCount,
    isLoading: false
}

describe('<InvestigationsInfo />', () => {
    const wrapper = mount(
        <InvestigationsInfo 
            {...investigationsInfoProps}
        />
    )
    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
})
