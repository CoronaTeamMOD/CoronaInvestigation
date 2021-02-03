import React from 'react';
import { mount } from 'enzyme';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import { familyContactReason, otherContactReason, noInvestigations, testInvestigations} from 'Utils/Testing/GroupedInvestigationForm/state';

import GroupedInvestigationForm from './GroupedInvestigationForm';
import InvestogationAccordion from './ContactsForm/InvestigationAccordion/InvestigationAccordion';


describe('<GroupedInvestigationForm />' , () => {
    afterEach(() => {
        jest.resetAllMocks();
    })
    
    it('renders' , () => {
        mockSelectors({
            ...familyContactReason,
            ...noInvestigations
        });
        const wrapper = mount(<GroupedInvestigationForm />);

        const groupedInvestigationForm = wrapper.find(GroupedInvestigationForm);

        expect(groupedInvestigationForm.exists()).toBeTruthy();
    });

    it('shows existing grouping reason' , () => {
        mockSelectors({
            ...familyContactReason,
            ...noInvestigations
        });
        const wrapper = mount(<GroupedInvestigationForm />);

        const groupingReasonHeader = wrapper.find('h6#groupingReason');

        expect(groupingReasonHeader.exists()).toBeTruthy();
        expect(groupingReasonHeader.text()).toBe(`סיבת הקיבוץ: מגעי משפחה`);
    })

    it('shows custom grouping reason', () => {
        mockSelectors({
            ...otherContactReason,
            ...noInvestigations
        });
        const wrapper = mount(<GroupedInvestigationForm />);

        const groupingReasonHeader = wrapper.find('h6#groupingReason');

        expect(groupingReasonHeader.exists()).toBeTruthy();
        expect(groupingReasonHeader.text()).toBe(`סיבת הקיבוץ: בדיקה`);
    })

    it('shows the table when there are investigations' , () => {
        mockSelectors({
            ...otherContactReason,
            ...testInvestigations
        });
        
        const wrapper = mount(<MockFormProvider><GroupedInvestigationForm /></MockFormProvider>);

        const investigationAccordion = wrapper.find(InvestogationAccordion);

        expect(investigationAccordion.exists()).toBeTruthy();
        expect(investigationAccordion).toHaveLength(1);

        const accordionHeadline = investigationAccordion.find('h5#accordion-headline-555');

        expect(accordionHeadline.exists()).toBeTruthy();
        expect(accordionHeadline.text()).toBe('מוטי בננה, 555, 207950171');
    });
});

export {}