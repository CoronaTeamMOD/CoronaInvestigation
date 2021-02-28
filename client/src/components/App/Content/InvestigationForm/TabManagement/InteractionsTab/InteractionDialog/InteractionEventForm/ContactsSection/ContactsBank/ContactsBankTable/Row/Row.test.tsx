import React from 'react';
import { mount } from 'enzyme';
import { Table, TableBody, Select, TextField } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import { person } from 'Utils/Testing/ContactsBankForm/state';
import MockBankFormProvider from 'Utils/Testing/ContactsBankForm/MockBankFormProvider';

import Row from './Row';


const getWrapper = (props : WrapperProps) => {
    const { setContactBankSpy, existingEventPersonInfos } = props;

    return mount(
        <MockFormProvider>
            <MockBankFormProvider 
                setContactBank={setContactBankSpy} 
                existingEventPersonInfos={existingEventPersonInfos}
            >
                <Table>
                    <TableBody>
                        <Row
                            contact={person}   
                        /> 
                    </TableBody>
                </Table>
            </MockBankFormProvider>
        </MockFormProvider>
    )
}

interface WrapperProps {
    setContactBankSpy? : jest.Mock<any, any>; 
    existingEventPersonInfos?: (number | undefined)[]
}

describe('<Row />', () => {
    const setContactBankSpy = jest.fn();
    const wrapper = getWrapper({setContactBankSpy});

    const checkboxSelector = 'input#person-checkbox-1234';
    const contactTypeSelector = Select;
    const extraInfoTypeSelectors = TextField;

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('disables existing person' , () => {
        const existingEventPersonInfos = [1234];
        const disabledWrapper = getWrapper({existingEventPersonInfos});

        expect(disabledWrapper.exists()).toBeTruthy();

        expect(disabledWrapper.find(checkboxSelector).exists()).toBeTruthy();
        expect(disabledWrapper.find(checkboxSelector).prop('disabled')).toBeTruthy();

        expect(disabledWrapper.find(contactTypeSelector).exists()).toBeTruthy();
        expect(disabledWrapper.find(contactTypeSelector).prop('disabled')).toBeTruthy();

        expect(disabledWrapper.find(extraInfoTypeSelectors).exists()).toBeTruthy();
        expect(disabledWrapper.find(extraInfoTypeSelectors).prop('disabled')).toBeTruthy();
    });

    describe('Checkbox: ', () => {
        it.todo('renders');
    
        it.todo('clicks');
    }); 

    describe('Contact Type Select: ', () => {
        it.todo('renders');
    
        it.todo('default value');

        it.todo('changes');
    });

    describe('extra info textfield', () => {
        it.todo('renders');

        it.todo('default value');

        it.todo('changes');
    });
});