import React from 'react';
import { mount } from 'enzyme';

import RefreshIcon from 'commons/Icons/RefreshIcon';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';

import LastUpdateMessage from './LastUpdateMessage';
import { subHours } from 'date-fns';
import { act } from 'react-dom/test-utils';

const fetchInvestigationStatistics = jest.fn();

const updateMessageProps = {
    lastUpdated : new Date(),
    fetchInvestigationStatistics
}

describe('<LastUpdateMessage />', () => {

    const wrapper = mount(
        <MockThemeProvider>
            <LastUpdateMessage 
                {...updateMessageProps}
            />
        </MockThemeProvider>
    );

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    describe('Time since message: ', () => {
        it('shows appropriate time message' , () => {
            const timeMessage = wrapper.find('p#time-since-message');

            expect(timeMessage.exists()).toBeTruthy();
            expect(timeMessage).toHaveLength(1);
            expect(timeMessage.text()).toBe('עודכן לאחרונה לפני פחות מדקה');
        });

        it('shows proper time message when' , async () => {
            const timeTestProps = {
                lastUpdated : subHours(new Date(), 3),
                fetchInvestigationStatistics
            }
            const timeTestWrapper = mount(
                <MockThemeProvider>
                    <LastUpdateMessage 
                        {...timeTestProps}
                    />
                </MockThemeProvider>
            );

            const timeMessage = timeTestWrapper.find('p#time-since-message');

            expect(timeMessage.exists()).toBeTruthy();
            expect(timeMessage).toHaveLength(1);
            expect(timeMessage.text()).toBe('עודכן לאחרונה לפני 3 שעות')
        });
    })
    
    describe('Refresh Icon:', () => {  
        it('renders' , () => {
            const refreshIcon = wrapper.find(RefreshIcon);

            expect(refreshIcon.exists()).toBeTruthy();
            expect(refreshIcon).toHaveLength(1);
        });

        it('clicks refresh icon', () => {
            const refreshIcon = wrapper.find(RefreshIcon);

            expect(fetchInvestigationStatistics).toBeCalledTimes(0);
            act(() => {
                refreshIcon.props().onClick()
            });
            expect(fetchInvestigationStatistics).toBeCalledTimes(1);
        });
    });

});
