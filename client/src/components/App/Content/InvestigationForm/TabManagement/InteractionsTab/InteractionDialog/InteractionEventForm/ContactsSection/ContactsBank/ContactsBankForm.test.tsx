import React from 'react';
import { mount } from 'enzyme';

import MockFormProvider from 'Utils/Testing/MockFormProvider'; 
import { existingPersonsMap } from 'Utils/Testing/ContactsBankForm/state';

import ContactsBankForm from './ContactsBankForm';

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

    it.todo('shows headline');

    it.todo('shows search bar');

    it.todo('shows bank table');

    describe('selected rows message', () => {
        it.todo('renders');
    
        it.todo('shows correct count'); 
    });

});