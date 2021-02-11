import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import PostponedCard from './PostponedCard';

const onClick = jest.fn();
const testTransferCount = 4;
const testWaitingCount = 5;

const props = {
    onClick,
    isLoading : false,
    transferRequestInvestigationsCount: testTransferCount,
    waitingForDetailsInvestigationsCount: testWaitingCount
}

describe('<PostponedCard />', () => {
    const wrapper = mount(
        <PostponedCard 
            {...props}
        />
    )
    
    it('rendes' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    describe('Transfer:', () => {
        const onClick = jest.fn();
        const wrapper = mount(
            <PostponedCard 
                {...props}
                onClick={onClick}
            />
        )

        it('shows correct count', () => {
            const count = wrapper.find('p#postponed-transfer-count')
            
            expect(count.exists()).toBeTruthy;
            expect(count).toHaveLength(1);
            expect(count.text()).toBe(String(testTransferCount));    
        });

        it('clicks' , () => {
            const transferWrapper = wrapper.find('div#postponed-transfer-wrapper');

            expect(onClick).not.toHaveBeenCalled();

            act(() => {
                transferWrapper.simulate('click');
            });

            expect(onClick).toHaveBeenCalled();
            expect(onClick).toHaveBeenCalledWith(statusToFilterConvertor[FilterRulesDescription.TRANSFER_REQUEST], FilterRulesDescription.TRANSFER_REQUEST);
        });
    });

    describe('Waiting:', () => {
        const onClick = jest.fn();
        const waitingTWrapper = mount(
            <PostponedCard 
                {...props}
                onClick={onClick}
            />
        )

        it('shows correct count', () => {
            const count = waitingTWrapper.find('p#postponed-waiting-count')
            
            expect(count.exists()).toBeTruthy;
            expect(count).toHaveLength(1);
            expect(count.text()).toBe(String(testWaitingCount));    
        });

        it('clicks' , () => {
            const waitingWrapper = waitingTWrapper.find('div#postponed-waiting-wrapper');
            
            expect(onClick).not.toHaveBeenCalled();
            
            act(() => {
                waitingWrapper.simulate('click');
            });

            expect(onClick).toHaveBeenCalled();
            expect(onClick).toHaveBeenCalledWith(statusToFilterConvertor[FilterRulesDescription.WAITING_FOR_DETAILS], FilterRulesDescription.WAITING_FOR_DETAILS);
        });
    });
});
