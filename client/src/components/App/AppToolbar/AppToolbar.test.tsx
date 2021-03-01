import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import UserType from 'models/enums/UserType';
import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AppToolbar/mockSelectors';
import useAppToolbar from 'Utils/Testing/AppToolbar/mockUseAppToolbar';

import AppToolbar, { toggleMessage } from './AppToolbar';
import { user } from 'Utils/Testing/AdminLandingPage/state';

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

    it('shows togglr' , () => {
        const toogleTooltipSelector = wrapper.find('#toggle-tooltip');
        jest.spyOn(useAppToolbar, 'useAppToolbar').mockImplementation(() => ([user, true, jest.fn(), jest.fn()]));

        expect(toogleTooltipSelector.exists()).toBeTruthy();
        expect(wrapper.find(toogleTooltipSelector).props().title).toBe(toggleMessage);    
    });
});