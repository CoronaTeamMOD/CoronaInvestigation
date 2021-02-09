import React from 'react';
import { mount } from 'enzyme';

import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AdminLandingPage/mockSelectors';

import DesksFilterCard from './desksFilterCard';

const onUpdateButtonClicked = jest.fn();

const mockedLocationState = {
    deskFilter : [2]
}

describe('<DesksFilterCard />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider>
            <MockRouter>
                <DesksFilterCard 
                    onUpdateButtonClicked={onUpdateButtonClicked}
                />
            </MockRouter>
        </MockThemeProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
