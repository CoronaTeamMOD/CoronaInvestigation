import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import timeRanges, { customTimeRange, defaultTimeRange } from 'models/enums/timeRanges';

import TimeRangeFilterCard from './TimeRangeFilterCard';

const onUpdateButtonClicked = jest.fn();

describe('<TimeRangeFilterCard />', () => {
    const wrapper = mount(
        <MockThemeProvider>
            <MockRouter>
                <TimeRangeFilterCard 
                    onUpdateButtonClicked={onUpdateButtonClicked}
                />
            </MockRouter>
        </MockThemeProvider>
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it.todo('shows headline')

    describe('Dropdown :' , () => {
        it.todo('renders');
        
        it.todo('shows defaultTimeRange');

        it.todo('grabs from history');

        it.todo('switch accordingly');

        it.todo('opens collapse on custom');
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
