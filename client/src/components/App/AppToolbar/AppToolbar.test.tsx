import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import UserType from 'models/enums/UserType';
import MockRouter from 'Utils/Testing/MockRouter';
import mockSelectors from 'Utils/Testing/AppToolbar/mockSelectors';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';

import AppToolbar from './AppToolbar';

describe('<AppToolbar />', () => {
    mockSelectors(UserType.INVESTIGATOR);
    const wrapper = mount(
        <MockThemeProvider>
            <MockRouter>
                <AppToolbar />
            </MockRouter>
        </MockThemeProvider>
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows toolbar title' , () => {
        const title = wrapper.find('h4#title');
        expect(title.exists()).toBeTruthy();
        expect(title).toHaveLength(1);
    });

    it('shows toolbar logo' , () => {
        const logo = wrapper.find('img#logo');
        expect(logo.exists()).toBeTruthy();
        expect(logo).toHaveLength(1);
    });
});