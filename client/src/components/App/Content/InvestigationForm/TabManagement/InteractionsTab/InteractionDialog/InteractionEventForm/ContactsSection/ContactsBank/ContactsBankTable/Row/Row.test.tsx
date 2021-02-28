import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
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
    const extraInfoTypeSelector = TextField;

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

        expect(disabledWrapper.find(extraInfoTypeSelector).exists()).toBeTruthy();
        expect(disabledWrapper.find(extraInfoTypeSelector).prop('disabled')).toBeTruthy();
    });

    describe('Checkbox: ', () => {
        const setContactBankSpy = jest.fn();
        const wrapper = getWrapper({setContactBankSpy});

        it('renders', () => {
            expect(wrapper.find(checkboxSelector).exists()).toBeTruthy();
            expect(wrapper.find(checkboxSelector).prop('disabled')).toBeFalsy();
        });
    
        it('clicks', () => {
            expect(setContactBankSpy).not.toHaveBeenCalled();

            act(() => {
                wrapper.find(checkboxSelector).simulate('click');
            });
            wrapper.update();

            expect(setContactBankSpy).toHaveBeenCalled();
            const expectedMap = new Map([[1234 , {checked : true , contactType : 1 , extraInfo : ''}]]);
            expect(setContactBankSpy).toHaveBeenCalledWith(expectedMap);
        });
    }); 

    describe('Contact Type Select: ', () => {
        const setContactBankSpy = jest.fn();
        const wrapper = getWrapper({setContactBankSpy});

        it('renders', () => {
            expect(wrapper.find(contactTypeSelector).exists()).toBeTruthy();
            expect(wrapper.find(contactTypeSelector).prop('disabled')).toBeFalsy();
        });
    
        it('default value', () => {
            expect(wrapper.find(contactTypeSelector).prop('defaultValue')).toBe(1);
        });

        it('changes', () => {
            expect(setContactBankSpy).not.toHaveBeenCalled();

            act(() => {
                //@ts-ignore
                wrapper.find(contactTypeSelector).props().onChange({ target : { value : 2 } });
            });
            wrapper.update();

            expect(setContactBankSpy).toHaveBeenCalled();
            const expectedMap = new Map([[1234 , {checked : false , contactType : 2 , extraInfo : ''}]]);
            expect(setContactBankSpy).toHaveBeenCalledWith(expectedMap);
        });
    });

    describe('extra info textfield', () => {
        const setContactBankSpy = jest.fn();
        const wrapper = getWrapper({setContactBankSpy});

        it('renders', () => {
            expect(wrapper.find(extraInfoTypeSelector).exists()).toBeTruthy();
            expect(wrapper.find(extraInfoTypeSelector).prop('disabled')).toBeFalsy();
        });
    
        it('default value', () => {
            expect(wrapper.find(extraInfoTypeSelector).prop('defaultValue')).toBe('');
        });

        it('changes', () => {
            expect(setContactBankSpy).not.toHaveBeenCalled();

            const testExtraInfo = 'test';
            act(() => {
                //@ts-ignore
                wrapper.find(extraInfoTypeSelector).props().onChange({ target : { value : testExtraInfo } });
            });
            wrapper.update();

            expect(setContactBankSpy).toHaveBeenCalled();
            const expectedMap = new Map([[1234 , {checked : false , contactType : 1 , extraInfo : testExtraInfo}]]);
            expect(setContactBankSpy).toHaveBeenCalledWith(expectedMap);
        });
    });
});