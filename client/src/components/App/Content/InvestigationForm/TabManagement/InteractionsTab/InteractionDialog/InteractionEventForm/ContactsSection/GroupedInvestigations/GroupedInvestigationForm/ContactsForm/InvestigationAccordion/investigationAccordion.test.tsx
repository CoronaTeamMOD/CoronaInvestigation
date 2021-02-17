import React from 'react'
import { mount } from 'enzyme';
import { Accordion } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import { testInvestigation, otherContactReason, testInvestigations} from 'Utils/Testing/GroupedInvestigationForm/state'; 

import InvestigationAccordion from './InvestigationAccordion';
import AccordionContent from './AccordionContent/AccordionContent';
import AccordionHeadline from './AccordionHeadline/AccordionHeadline';

const accordionProps = {
    investigation: testInvestigation,
    isGroupReasonFamily: false
}

describe('<InvestigationAccordion />', () => {
    mockSelectors({
        ...otherContactReason,
        ...testInvestigations
    });
    const wrapper = mount(
        <MockFormProvider>
            <InvestigationAccordion 
                {...accordionProps}
            />
        </MockFormProvider>
    )
    
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('shows an accordion' , () => {
        const accordion = wrapper.find(Accordion);

        expect(accordion.exists()).toBeTruthy();
        expect(accordion).toHaveLength(1);
    })

    it('shows accordionHeadline' , () => {
        const accordionHeadline = wrapper.find(AccordionHeadline);

        expect(accordionHeadline.exists()).toBeTruthy();
    })

    it('shows accordion content' , () => {
        const accordionContent = wrapper.find(AccordionContent);

        expect(accordionContent.exists()).toBeTruthy();
    })
});