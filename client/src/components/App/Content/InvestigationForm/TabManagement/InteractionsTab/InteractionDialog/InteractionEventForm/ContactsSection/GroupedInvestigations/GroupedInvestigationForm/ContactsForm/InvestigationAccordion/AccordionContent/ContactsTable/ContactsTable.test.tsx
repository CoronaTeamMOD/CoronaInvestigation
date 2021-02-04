import React from 'react';
import { mount } from 'enzyme';
import { Checkbox } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import { testEventNode, testPersonalDetails } from 'Utils/Testing/GroupedInvestigationForm/state';

import ContactsTable from './ContactsTable';

describe('<ContactsTable />', () => {
    mockSelectors();
    describe('no events' , () => {
        const wrapper = mount(
            <MockFormProvider>
                    <ContactsTable
                        isGroupReasonFamily={false}
                        events={[]}
                        existingIds={[]}
                    />
            </MockFormProvider>
        )

        it('renders' , () => {
            expect(wrapper.exists()).toBeTruthy();
        })

        it('shows proper error message', () => {
            const errorMsg = wrapper.find('h5#errorMessage');

            expect(errorMsg.exists()).toBeTruthy();
            expect(errorMsg.text()).toBe('אין תוצאות מתאימות')
        });
    });

    describe('test events', () => {
        describe('id doesnt exist' , () => {
            const wrapper = mount(
                <MockFormProvider>
                        <ContactsTable
                            isGroupReasonFamily={false}
                            events={[testEventNode]}
                            existingIds={[]}
                        />
                </MockFormProvider>
            )

            it('renders' , () => {
                expect(wrapper.exists()).toBeTruthy();
            });

            it('shows row' , () => {
                const tableRow = wrapper.find('tr#person-row-666');
                
                expect(tableRow.exists()).toBeTruthy();
                expect(tableRow).toHaveLength(1);
            });

            it('doesnt disable row' , () => {
                const tableRow = wrapper.find('tr#person-row-666');

                expect(tableRow.props().className?.indexOf('makeStyles-disabled')).toBe(-1);
            });

            it('doesnt disable checkbox' , () => {
                const checkbox = wrapper.find(Checkbox);
                
                expect(checkbox.exists()).toBeTruthy();
                expect(checkbox.props().disabled).toBeFalsy();
            });
        })
        describe('id already exists', () => {
            const wrapper = mount(
                <MockFormProvider>
                        <ContactsTable
                            isGroupReasonFamily={false}
                            events={[testEventNode]}
                            existingIds={[testPersonalDetails.identificationNumber]}
                        />
                </MockFormProvider>
            )

            it('renders' , () => {
                expect(wrapper.exists()).toBeTruthy();
            });

            it('shows row' , () => {
                const tableRow = wrapper.find('tr#person-row-666');
                
                expect(tableRow.exists()).toBeTruthy();
                expect(tableRow).toHaveLength(1);
            });

            it('disables row' , () => {
                const tableRow = wrapper.find('tr#person-row-666');

                expect(tableRow.props().className?.indexOf('makeStyles-disabled')).not.toBe(-1);
            });

            it('disables checkbox' , () => {
                const checkbox = wrapper.find(Checkbox);
                
                expect(checkbox.exists()).toBeTruthy();
                expect(checkbox.props().disabled).toBeTruthy();
            });
        });

        describe('family contact' , () => {
            const wrapper = mount(
                <MockFormProvider>
                        <ContactsTable
                            isGroupReasonFamily={true}
                            events={[testEventNode]}
                            existingIds={[]}
                        />
                </MockFormProvider>
            )

            it('renders' , () => {
                expect(wrapper.exists()).toBeTruthy();
            });

            it('doesnt show row' , () => {
                const tableRow = wrapper.find('tr#person-row-666');
                
                expect(tableRow.exists()).toBeFalsy();
            });
        });
    });
});
