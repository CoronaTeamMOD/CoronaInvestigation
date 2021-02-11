import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import AppToolbar from './AppToolbar';

describe('<AppToolbar />', () => {
    const wrapper = mount(
        <AppToolbar />
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows investigators table head' , () => {
        const title = wrapper.find('h4#title');
        expect(title.exists()).toBeTruthy();
        expect(title).toHaveLength(1);
    });
});