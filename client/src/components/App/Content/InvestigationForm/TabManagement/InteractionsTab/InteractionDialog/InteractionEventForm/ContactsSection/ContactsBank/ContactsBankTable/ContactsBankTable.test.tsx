import React from 'react';
import { mount } from 'enzyme';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import { existingPersonsMap, person } from 'Utils/Testing/ContactsBankForm/state';

import ContactsBankTable from './ContactsBankTable';

const getWrapper = (query? : string | number) => {
    const props = {
        existingPersons: existingPersonsMap,
        query: query ? String(query) : ''
    }

    return mount(
        <MockFormProvider>
            <ContactsBankTable
                {...props}    
            />  
        </MockFormProvider>
    )
}

describe('<ContactsBankTable />', () => {
    const wrapper = getWrapper()
    const personRowSelector = 'tr#person-row-1234'

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows row on empty query' , () => {
        const personRow = wrapper.find(personRowSelector);

        expect(personRow.exists()).toBeTruthy();
        expect(personRow).toHaveLength(1);
    });

    describe('Filters:', () => {
        const searchableFields : (keyof typeof person)[] = ['firstName','lastName','phoneNumber','identificationNumber']
    
        searchableFields.forEach(fieldName => {
            it(`by ${fieldName}:` , () => {
                const filterWrapper = getWrapper(person[fieldName]);

                expect(filterWrapper.exists()).toBeTruthy()
                expect(filterWrapper.find(personRowSelector).exists()).toBeTruthy();
            });
        });

        it('returns nothing when search is empty' , () => {
            const blankFilterWrapper = getWrapper('test');
            
            expect(blankFilterWrapper.exists()).toBeTruthy();

            expect(blankFilterWrapper.find(personRowSelector).exists()).toBeFalsy();
        });
        
    });
    
});