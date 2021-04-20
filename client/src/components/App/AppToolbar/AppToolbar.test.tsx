import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import UserTypeCodes from 'models/enums/UserTypeCodes';
import MockRouter from 'Utils/Testing/MockRouter';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AppToolbar/mockSelectors';
import useAppToolbar from 'Utils/Testing/AppToolbar/mockUseAppToolbar';

import AppToolbar, { toggleMessage } from './AppToolbar';
import { user } from 'Utils/Testing/AppToolbar/state';

describe('<AppToolbar />', () => {
    const testUser = user(UserTypeCodes.INVESTIGATOR);
    mockSelectors(UserTypeCodes.INVESTIGATOR);
    const wrapper = mount(
        <MockRouter>
            <MockThemeProvider>
                <AppToolbar />
            </MockThemeProvider>
        </MockRouter>
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

    it('shows logout button', () => {
        const logoutButton = wrapper.find('button#logout-button');
        expect(logoutButton.exists()).toBeTruthy();
        expect(logoutButton).toHaveLength(1);
    });

    it('shows logout tooltip message' , () => {
        const toolTipMessage = 'התנתקות מהמערכת';
        expect(wrapper.find('span#logout-tooltip').props().title).toBe(toolTipMessage);
    });

    it('shows welcome message' , () => {
        const userName = testUser.data.authorityByAuthorityId?.authorityName ? 
                            testUser.data.userName +" (" + testUser.data.authorityByAuthorityId.authorityName + ")"  : testUser.data.userName;
        const welcomeMessage = `שלום ${userName}`;
        expect(wrapper.find('#welcome-message').props().title).toBe(welcomeMessage);
    });

    // it('shows toggle' , () => {
    //     const toogleTooltipSelector = wrapper.find('#toggle-tooltip');
    //     jest.spyOn(useAppToolbar, 'useAppToolbar').mockImplementation(() => ([user, true, jest.fn(), jest.fn()]));

    //     expect(toogleTooltipSelector.exists()).toBeTruthy();
    //     expect(wrapper.find(toogleTooltipSelector).props().title).toBe(toggleMessage);    
    // });
});