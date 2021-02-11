import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import MockMuiPickersUtilsProvider from 'Utils/Testing/MockMuiPickersUtilsProvider';
import timeRanges, { customTimeRange, defaultTimeRange } from 'models/enums/timeRanges';

import TimeRangeFilterCard from './TimeRangeFilterCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import thunk from 'redux-thunk';

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
        const mockedLocationState = {
            timeRangeFilter: customTimeRange
        };
        const wrapper = mount(
            <MockThemeProvider>
                <MockMuiPickersUtilsProvider>
                    <MockRouter locationState={mockedLocationState}>
                        <TimeRangeFilterCard 
                            onUpdateButtonClicked={onUpdateButtonClicked}
                        />
                    </MockRouter>
                </MockMuiPickersUtilsProvider>
            </MockThemeProvider>
        );
        const datepickSelector = 'div#time-range-filter-datepick';
        const startSelector = 'DatePick#time-range-filter-datepick-start';
        const endSelector = 'DatePick#time-range-filter-datepick-end';

        const datepick = wrapper.find(datepickSelector);

        it('renders', () => {
            expect(wrapper.exists()).toBeTruthy;
        });

        it('renders startdate', () => {
            const startdate = datepick.find(startSelector);

            expect(startdate.exists()).toBeTruthy();
        });

        it('changes startdate', () => {
            let startdate = wrapper.find(startSelector);
            const testDate = new Date('2020-09-11T00:00:00.000Z');

            expect(startdate.prop('value')).toBe(customTimeRange.startDate);
            
            act(() => {
                //@ts-ignore
                startdate.props().onChange(testDate);
            });
            wrapper.update();
            startdate = wrapper.find(startSelector);
            const inputDate = new Date(String(startdate.prop('value')));
            
            expect(inputDate.getTime()).toBe(testDate.getTime());
        });

        it('renders enddate', () => {
            const enddate = datepick.find(endSelector);

            expect(enddate.exists()).toBeTruthy();
        });

        it('changes enddate' , () => {
            let endDate = wrapper.find(endSelector);
            const testDate = new Date('2020-09-12T00:00:00.000Z');
            
            expect(endDate.prop('value')).toBe(customTimeRange.endDate);
            
            act(() => {
                //@ts-ignore
                endDate.props().onChange(testDate);
            });
            wrapper.update();
            endDate = wrapper.find(endSelector);
            const inputDate = new Date(String(endDate.prop('value')));
            
            expect(inputDate.getTime()).toBe(testDate.getTime());
        });

        it('shows error' , () => {
            const errorMessageSelector = 'p#time-range-error-message';
            const updateButton = wrapper.find(UpdateButton);

            const endDate = wrapper.find(endSelector);
            const startDate = wrapper.find(startSelector);
            const invalidDateRange = {
                start : new Date('2020-09-12T00:00:00.000Z'),
                end : new Date('2020-09-11T00:00:00.000Z'),
            }
            expect(wrapper.find(errorMessageSelector).exists()).toBeFalsy();

            act(() => {
                //@ts-ignore
                startDate.props().onChange(invalidDateRange.start);
                //@ts-ignore
                endDate.props().onChange(invalidDateRange.end);
            });
            act(() => {
                updateButton.simulate('click');
            });
            wrapper.update();
            
            expect(wrapper.find(errorMessageSelector).exists()).toBeTruthy();
            expect(onUpdateButtonClicked).not.toHaveBeenCalled();
        })
    });

    describe('UpdateButton:' , () => {
        const updateButton = wrapper.find(UpdateButton);

        it('renders', () => {
            expect(updateButton.exists()).toBeTruthy();
            expect(updateButton).toHaveLength(1);
        });

        it('clicks' , () => {
            const dropdownSelector = 'div#time-range-filter-dropdown';
            const dropdown = wrapper.find(dropdownSelector);
            const selectInput = dropdown.parent();
            
            expect(onUpdateButtonClicked).not.toHaveBeenCalled();
            
            act(() => {
                selectInput.props().onChange({target : { value : timeRanges[2].id}});
            });
            act(() => {
                updateButton.simulate('click');
            });
            wrapper.update();

            expect(onUpdateButtonClicked).toHaveBeenCalled();
            expect(onUpdateButtonClicked).toHaveBeenCalledWith(timeRanges[2]);
        });

        it('clicks with custom value' , () => {
            const startSelector = 'DatePick#time-range-filter-datepick-start';
            const endSelector = 'DatePick#time-range-filter-datepick-end';

            const mockedLocationState = {
                timeRangeFilter: customTimeRange
            };
            const wrapper = mount(
                <MockThemeProvider>
                    <MockMuiPickersUtilsProvider>
                        <MockRouter locationState={mockedLocationState}>
                            <TimeRangeFilterCard 
                                onUpdateButtonClicked={onUpdateButtonClicked}
                            />
                        </MockRouter>
                    </MockMuiPickersUtilsProvider>
                </MockThemeProvider>
            );
            const updateButton = wrapper.find(UpdateButton);
            const endDate = wrapper.find(endSelector);
            const startDate = wrapper.find(startSelector);
            const validDateRange = {
                start : new Date('2020-09-11T00:00:00.000Z'),
                end : new Date('2020-09-12T00:00:00.000Z'),
            }

            act(() => {
                //@ts-ignore
                startDate.props().onChange(validDateRange.start);
                //@ts-ignore
                endDate.props().onChange(validDateRange.end);
            });
            act(() => {
                updateButton.simulate('click');
            });
            wrapper.update();

            expect(onUpdateButtonClicked).toHaveBeenCalled();
            expect(onUpdateButtonClicked).toHaveBeenCalledWith({
                ...customTimeRange,
                startDate : "2020-09-11",
                endDate : "2020-09-12",
            });
        });
    });
})
