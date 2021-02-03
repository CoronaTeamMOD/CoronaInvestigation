import React from 'react';
import { mount } from 'enzyme';
import { FormProvider } from 'react-hook-form';

import mockSelectors from './mockSelectors';
import GroupedInvestigationForm from '../GroupedInvestigationForm';
import InvestogationAccordion from '../ContactsForm/InvestigationAccordion/InvestigationAccordion';
import { familyContactReason, otherContactReason, noInvestigations, testInvestigations} from './states';

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
        //@ts-ignore - this is stright out of the documentation (!) https://github.com/react-hook-form/react-hook-form/blob/4babac795fd7f51d4d4d9bcb382a5551886842f4/src/useFormContext.test.tsx#L15
        const wrapper = mount(<FormProvider><GroupedInvestigationForm /></FormProvider>);

        const investigationAccordion = wrapper.find(InvestogationAccordion);

        expect(investigationAccordion.exists()).toBeTruthy();
        expect(investigationAccordion).toHaveLength(1);

        const accordionHeadline = investigationAccordion.find('h5#accordion-headline-555');

        expect(accordionHeadline.exists()).toBeTruthy();
        expect(accordionHeadline.text()).toBe('מוטי בננה, 555, 207950171');
    });
});



// const investigatedPatient = useSelector<StoreStateType, InvestigatedPatient>(state => state.investigation.investigatedPatient);
// const investigationEndTime = useSelector<StoreStateType, Date | null>(state => state.investigation.endTime);

export {}