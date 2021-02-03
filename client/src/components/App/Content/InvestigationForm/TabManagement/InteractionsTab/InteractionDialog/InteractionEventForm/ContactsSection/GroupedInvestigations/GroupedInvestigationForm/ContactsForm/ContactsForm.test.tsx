import React from 'react'
import { mount } from 'enzyme';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import { testInvestigationsNodes } from 'Utils/Testing/GroupedInvestigationForm/state'; 

import ContactsForm from './ContactsForm';
import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const reason = 'בדיקה';
const formHeadlineText = 'מאומתים המקובצים לחקירה :';
const formProps = {
    reason,
    isGroupReasonFamily: false,
    investigations: testInvestigationsNodes
}

describe('<ContactsForm />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockFormProvider>
            <ContactsForm 
                {...formProps}
            />
        </MockFormProvider>
    )
    
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows headline', () => {
        const headline = wrapper.find('h5#groupingFormHeadline');
        
        expect(headline.exists()).toBeTruthy();
        expect(headline.text()).toBe(formHeadlineText);
    })

    it('shows grouping reason' , () => {
        const groupingReason = wrapper.find('h6#groupingReason');

        expect(groupingReason.exists()).toBeTruthy();
        expect(groupingReason.text()).toBe(`סיבת הקיבוץ: ${reason}`);
    });

    it('shows the accordion', () => {
        const investigationAccordion = wrapper.find(InvestigationAccordion);

        expect(investigationAccordion.exists()).toBeTruthy();
    })

    it('shows an empty count of selected rows', () => {
        const selectedRowsMsg = wrapper.find('h6#selectedRowsMsg');

        expect(selectedRowsMsg.exists()).toBeTruthy();
        expect(selectedRowsMsg.text()).toBe('נבחרו 0 שורות');
    });
})

export {}
