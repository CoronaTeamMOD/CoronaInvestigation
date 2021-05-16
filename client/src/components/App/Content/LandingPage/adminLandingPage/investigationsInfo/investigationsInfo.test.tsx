import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import invesitgationInfoStatistics from 'Utils/Testing/AdminLandingPage/investigationInfoStatistics';

import InvestigationsInfo from './investigationsInfo';
import { convertorsToGraph } from './convertorsToGraph';
 
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

    describe('columns:' , () => {
        const foramttedColumns = Object.values(convertorsToGraph).map(obj => obj.id);
        foramttedColumns.forEach((column , index) => {
            const onInfoButtonClick = jest.fn();
            const columnsWrapper = mount(
                <InvestigationsInfo 
                    {...investigationsInfoProps}
                    onInfoButtonClick={onInfoButtonClick}
                />
            )

            const currentItem = columnsWrapper.find(`button#info-button-${index}`);
            describe(`${column}:`, () => {       
                it(`renders`, () => {
                    expect(currentItem.exists()).toBeTruthy();
                    expect(currentItem).toHaveLength(1);

                    const itemName = currentItem.find('p[aria-labelledby="button-name"]');

                    expect(itemName.exists()).toBeTruthy();
                    expect(itemName).toHaveLength(1);
                    expect(itemName.text()).toBe(column);
                });

                it(`clicks correctly`, () => {
                    expect(onInfoButtonClick).toHaveBeenCalledTimes(0);
                    
                    act(() => {
                        currentItem.simulate('click');
                    });

                    expect(onInfoButtonClick).toHaveBeenCalledTimes(1);
                    expect(onInfoButtonClick).toHaveBeenCalledWith(statusToFilterConvertor[column] , column);
                });
            });
        });
    });

    it('shows correct amount of investigations' , () => {
        const investigationsCount = wrapper.find('p#investigations-count');

        expect(investigationsCount.exists()).toBeTruthy();
        expect(investigationsCount).toHaveLength(1);
        expect(investigationsCount.text()).toBe(String(allInvestigationsCount));
    });

    describe('Next Page Arrow: ', () => {
        const onInfoButtonClick = jest.fn();
        const nextPageWrapper = mount(
            <InvestigationsInfo 
                {...investigationsInfoProps}
                onInfoButtonClick={onInfoButtonClick}
            />
        );

        const nextPageArrowSelector = 'button#next-page-arrow'; 
        it('renders' , () => {
            expect(nextPageWrapper.find(nextPageArrowSelector).exists()).toBeTruthy();
        });

        it('clicks correctly' , () => {
            expect(onInfoButtonClick).toHaveBeenCalledTimes(0);

            act(() => {
                nextPageWrapper.find(nextPageArrowSelector).simulate('click');
            });
            nextPageWrapper.update();

            expect(onInfoButtonClick).toHaveBeenCalledTimes(1);
            expect(onInfoButtonClick).toHaveBeenCalledWith({});
        })
    })
    
})
