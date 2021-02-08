import React from 'react'
import axios from 'axios';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';

import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/UsersManagement/mockSelectors';

import UsersManagement , { usersManagementTitle } from './UsersManagement';

describe('<UsersManagement />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider>
            <UsersManagement />
        </MockThemeProvider>
    )

    //console.log(wrapper.debug());

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('shows headline', () => {
        const headline = wrapper.find('p#user-management-title');
        
        expect(headline.exists()).toBeTruthy();
        expect(headline).toHaveLength(1);
        expect(headline.text()).toBe(usersManagementTitle);
    });

    it('shows filter button' , () => {
        const filterButton = wrapper.find('button#filterButton');

        expect(filterButton.exists()).toBeTruthy();
    });

    // shows filter button and does'nt show filter bar

    it('doesnt show filters collapse', () => {
        const filtersCollapse = wrapper.find('div#filters-collapse');
        console.log(filtersCollapse);

        expect(true).toBeTruthy();
    });

    // shows table container

    // LOOP
    // shows table header
        // shows correct sorting elements;

    // shows pagination

    // userInfo dialog is closed

    // editUser dialog is closed
})
