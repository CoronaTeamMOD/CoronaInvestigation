import React from 'react';
import { mount } from 'enzyme';

import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/InvestigationInfo/mockSelectors';
import MockCommentContextProvider from 'Utils/Testing/InvestigationInfo/MockCommentContextProvider';

import InvestigationMenu from './InvestigationMenu';

const comment = 'זוהי הערה';
const setComment = jest.fn();
const props = {
    comment,
    setComment
}

describe('<InvestigationMenu />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider >
            <MockCommentContextProvider {...props}>
                <InvestigationMenu />
            </MockCommentContextProvider>
        </MockThemeProvider>
    )

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
})
