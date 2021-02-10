import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import MockMuiPickersUtilsProvider from 'Utils/Testing/MockMuiPickersUtilsProvider';
import timeRanges, { customTimeRange, defaultTimeRange } from 'models/enums/timeRanges';

import TimeRangeFilterCard from './TimeRangeFilterCard';

const onUpdateButtonClicked = jest.fn();

describe('<TimeRangeFilterCard />', () => {
    const wrapper = mount(
        <MockThemeProvider>
            <MockMuiPickersUtilsProvider>
                <MockRouter>
                    <TimeRangeFilterCard 
                        onUpdateButtonClicked={onUpdateButtonClicked}
                    />
                </MockRouter>
            </MockMuiPickersUtilsProvider>
        </MockThemeProvider>
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows title', () => {
        const title = wrapper.find('p#time-range-filter-title');

        expect(title.exists()).toBeTruthy();
        expect(title).toHaveLength(1);
    });

    describe('Dropdown :' , () => {
        const dropdownSelector = 'div#time-range-filter-dropdown';
        const dropdown = wrapper.find(dropdownSelector);
        const selectInput = dropdown.parent();

        it('renders', () => {
            expect(dropdown.exists()).toBeTruthy();
        });
        
        it('shows defaultTimeRange', () => {
            expect(selectInput.exists()).toBeTruthy();
            expect(selectInput.prop('value')).toBe(defaultTimeRange.id);
            expect(dropdown.text()).toBe(defaultTimeRange.displayName);
        });

        
        it('switches accordingly' , () => {
            act(() => {
                selectInput.props().onChange({target : { value : timeRanges[2].id}});
            });
            wrapper.update();

            expect(wrapper.find(dropdownSelector).parent().prop('value')).toBe(timeRanges[2].id);
            expect(wrapper.find(dropdownSelector).text()).toBe(timeRanges[2].displayName);
        });

        it('opens collapse on custom', () => {
            act(() => {
                selectInput.props().onChange({target : { value : customTimeRange.id}});
            });
            wrapper.update();
            
            
            const datePick = wrapper.find('div#time-range-filter-datepick');
            expect(datePick.exists()).toBeTruthy();
            expect(datePick).toHaveLength(1);
            expect(datePick.getDOMNode()).toBeVisible();
        });

        describe('history: ', () => {
            const selectedTimeRange = timeRanges[1];
            const mockedLocationState = {
                timeRangeFilter: selectedTimeRange
            };
            const histroryWrapper = mount(
                <MockThemeProvider>
                    <MockRouter locationState={mockedLocationState}>
                        <TimeRangeFilterCard 
                            onUpdateButtonClicked={onUpdateButtonClicked}
                        />
                    </MockRouter>
                </MockThemeProvider>
            );
            const dropdown = histroryWrapper.find(dropdownSelector);

            it('renders', () => {
                expect(histroryWrapper.exists()).toBeTruthy();
            });

            it('shows time range from history', () => {
                const selectInput = dropdown.parent();

                expect(selectInput.exists()).toBeTruthy();
                expect(selectInput.prop('value')).toBe(selectedTimeRange.id);
                expect(dropdown.text()).toBe(selectedTimeRange.displayName);
            });
        });
    });

    describe('DateRange: ' , () => {
        it.todo('renders');

        it.todo('renders startdate');

        it.todo('changes startdate');

        it.todo('renders enddate');

        it.todo('changes enddate');
        
        // errors ? 
    });

    describe('UpdateButton' , () => {
        it.todo('renders');

        it.todo('clicks');

        it.todo('clicks with default value');

        it.todo('clicks with custom value');

        //it.todo('stops invalid dates'); ?
    });
})
