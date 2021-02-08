import React from 'react'
import axios from 'axios';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';

import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/UsersManagement/mockSelectors';

import UsersManagement from './UsersManagement';

describe('<UsersManagement />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider>
            <UsersManagement />
        </MockThemeProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })
})
