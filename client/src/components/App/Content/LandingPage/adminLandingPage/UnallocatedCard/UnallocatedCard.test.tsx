import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import UnallocatedCard from './UnallocatedCard';

const onClick = jest.fn();
const testCount = 7;

const props = {
    onClick,
    isLoading: false,
    unallocatedInvestigationsCount: testCount
}

describe('<UnallocatedCard />', () => {
    const wrapper = mount(
        <UnallocatedCard
            {...props}
        />
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows correct amount of investigations', () => {
        const count = wrapper.find('p#unallocated-amount');
        
        expect(count.exists()).toBeTruthy();
        expect(count).toHaveLength(1);
        expect(count.text()).toBe(String(testCount));
    });

    it('clicks' , () => {
        const cardWrapper = wrapper.find('#unallocated-card-wrapper');

        expect(onClick).not.toHaveBeenCalled();
        
        act(() => {
            cardWrapper.simulate('click');
        });

        expect(onClick).toBeCalled();
        expect(onClick).toHaveBeenCalledWith(statusToFilterConvertor[FilterRulesDescription.UNALLOCATED]);
    });
})
