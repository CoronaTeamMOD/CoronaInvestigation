import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MockFormProvider from 'Utils/Testing/MockFormProvider';

import InvestigatorAllocationDialog from './InvestigatorAllocationDialog';

const contentProps = {
    isOpen: true,
    handleCloseDialog: () => {},
    fetchInvestigators: () => {},
    allocateInvestigationToInvestigator: () => {},
    groupIds: [],
    epidemiologyNumbers: [],
    onSuccess: () => {}
};

describe('<InvestigatorAllocationDialog />', () => {
    let wrapper = mount(
        <MockFormProvider >
            <InvestigatorAllocationDialog 
                {...contentProps}
            />
        </MockFormProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('renders InvestigatorsTable' , () => {
        const investigatorsTable = wrapper.find(InvestigatorsTable);

        expect(investigatorsTable.exists()).toBeTruthy();
    })
});