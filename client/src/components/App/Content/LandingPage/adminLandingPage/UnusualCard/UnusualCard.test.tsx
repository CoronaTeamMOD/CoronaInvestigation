import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import UnusualCard from './UnusualCard';

const onUnusualCompletedNoContactInvestigationsClick = jest.fn();
const onUnusualInProgressInvestigationsClick = jest.fn();
const testInProgressCount = 7;
const testCompletedCount = 3;

const props = {
    onUnusualCompletedNoContactInvestigationsClick,
    onUnusualInProgressInvestigationsClick,
    isLoading : false,
    unusualInProgressInvestigationsCount: testInProgressCount,
    unusualCompletedNoContactInvestigationsCount: testCompletedCount,
}

describe('<UnusualCard />', () => {
    const wrapper = mount(
        <UnusualCard 
            {...props}
        />
    );

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();    
    });

    describe('Completed:', () => {
        it('shows correct count' , () => {
            const count = wrapper.find('p#unusual-completed-count');

            expect(count.exists()).toBeTruthy();
            expect(count).toHaveLength(1);
            expect(count.text()).toBe(String(testCompletedCount));
        });

        it('clicks' , () => {
            const completedWrapper = wrapper.find('div#unusual-completed-wrapper');

            expect(onUnusualCompletedNoContactInvestigationsClick).not.toHaveBeenCalled();

            act(() => {
                completedWrapper.simulate('click');
            });

            expect(onUnusualCompletedNoContactInvestigationsClick).toHaveBeenCalled();
            expect(onUnusualCompletedNoContactInvestigationsClick).toHaveBeenCalledWith(statusToFilterConvertor[FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT]);
        });
    });

    describe('Progress:', () => {
        it('shows correct count' , () => {
            const count = wrapper.find('p#unusual-progress-count');

            expect(count.exists()).toBeTruthy();
            expect(count).toHaveLength(1);
            expect(count.text()).toBe(String(testInProgressCount));
        });

        it('clicks' , () => {
            const progressWrapper = wrapper.find('div#unusual-progress-wrapper');

            expect(onUnusualInProgressInvestigationsClick).not.toHaveBeenCalled();

            act(() => {
                progressWrapper.simulate('click');
            });

            expect(onUnusualInProgressInvestigationsClick).toHaveBeenCalled();
            expect(onUnusualInProgressInvestigationsClick).toHaveBeenCalledWith(statusToFilterConvertor[FilterRulesDescription.UNUSUAL_IN_PROCESS]);
        });
    });
    
})
