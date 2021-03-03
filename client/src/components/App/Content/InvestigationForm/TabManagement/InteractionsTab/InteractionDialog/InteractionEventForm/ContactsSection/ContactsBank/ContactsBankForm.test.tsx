import React from 'react';
import { mount } from 'enzyme';

import MockFormProvider from 'Utils/Testing/MockFormProvider'; 
import { existingPersonsMap, contactBankMap } from 'Utils/Testing/ContactsBankForm/state';
import MockBankFormProvider from 'Utils/Testing/ContactsBankForm/MockBankFormProvider';

import ContactsBankForm from './ContactsBankForm';
import ContactsBankTable from './ContactsBankTable/ContactsBankTable';
import ContactsBankSearchBar from './ContactsBankSearchBar/ContactsBankSearchBar';

describe('<ContactsBankForm />', () => {
    const wrapper = mount(
        <MockFormProvider>
            <ContactsBankForm
                existingPersons={existingPersonsMap}
            />  
        </MockFormProvider>
    );

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows headline', () => {
        const headline = wrapper.find('h5#contacts-bank-headline');

        expect(headline.exists()).toBeTruthy();
        expect(headline.text()).toBe('בנק מגעים:');
    });

    it('shows search bar', () => {
        const searchBar = wrapper.find(ContactsBankSearchBar);

        expect(searchBar.exists()).toBeTruthy();
    });

    it('shows bank table' , () => {
        const bankTable = wrapper.find(ContactsBankTable);

        expect(bankTable.exists()).toBeTruthy();
    });

    describe('selected rows message', () => {
        const selectedRowsWrapper = mount(
            <MockFormProvider>
                <MockBankFormProvider contactBank={contactBankMap}>
                    <ContactsBankForm
                        existingPersons={existingPersonsMap}
                    />  
                </MockBankFormProvider>
            </MockFormProvider>
        )
        const selectedRows = selectedRowsWrapper.find('p#contacts-bank-selected-count')
        
        it('renders', () => {
            expect(selectedRows.exists()).toBeTruthy();
        });
    
        it('shows correct count', () => {
            expect(selectedRows.text()).toBe('נבחרו 1 מגעים מבנק מגעים');
        }); 
    });

});