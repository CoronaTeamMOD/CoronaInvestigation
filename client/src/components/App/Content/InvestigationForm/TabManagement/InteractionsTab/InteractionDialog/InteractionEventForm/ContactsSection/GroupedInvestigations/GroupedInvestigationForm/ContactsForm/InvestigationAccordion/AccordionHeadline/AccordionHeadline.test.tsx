import React from 'react'
import { mount } from 'enzyme';
import { AccordionSummary } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';

import AccordionHeadline from './AccordionHeadline';

const headlineProps = {
    epidemiologyNumber : 555,
    identityNumber: '207950171',
    fullName: 'מוטי בננה'
}

describe('<AccordionHeadline />' , () => {
    const wrapper = mount(
        <MockFormProvider>
            <AccordionHeadline 
                {...headlineProps}
            />
        </MockFormProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('renders AccordionSummary' , () => {
        const accordionSummary = wrapper.find(AccordionSummary);

        expect(accordionSummary.exists()).toBeTruthy();
    })

    it('renders headline appropriately' , () => {
        const { epidemiologyNumber, identityNumber, fullName } = headlineProps;

        const headline = wrapper.find(`h5#accordion-headline-${epidemiologyNumber}`);

        expect(headline.exists()).toBeTruthy();
        expect(headline.text()).toBe(`${fullName}, ${epidemiologyNumber}, ${identityNumber}`);
    })
})