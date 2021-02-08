import React from 'react';
import { mount } from 'enzyme';
import { Checkbox, Table, TableRow } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import { testEventNode } from 'Utils/Testing/GroupedInvestigationForm/state';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import MockGroupedInvestigationsProvider from 'Utils/Testing/GroupedInvestigationForm/MockGroupedInvestigationsProvider';

import TableRows from './TableRows';

const rowsProps = {
    isGroupReasonFamily: false,
    events : [testEventNode],
    existingIds: []
}

describe('<TableRows />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockFormProvider>
            <Table>
                <TableRows 
                    {...rowsProps}
                />
            </Table>
        </MockFormProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    describe('not checked' , () => {
        expect(wrapper.exists()).toBeTruthy();

        it('doesnt show checked checkbox' , () => {
            const checkbox = wrapper.find(Checkbox)

            expect(checkbox.exists()).toBeTruthy();
            expect(checkbox.props().checked).toBeFalsy();
        });

        it('doesnt give the row selected class', () => {
            const row = wrapper.find(TableRow);

            expect(row.props().className?.indexOf('selected')).toBe(-1);
        });
    });

    describe('checked', () => {
        const checkedWrapper = mount(
            <MockGroupedInvestigationsProvider>
                <MockFormProvider>
                    <Table>
                        <TableRows 
                            {...rowsProps}
                        />
                    </Table>
                </MockFormProvider>
            </MockGroupedInvestigationsProvider>
        )
        it('renders' , () => {
            expect(checkedWrapper.exists()).toBeTruthy();
        });

        it('shows checked checkbox' , () => {
            const checkbox = checkedWrapper.find(Checkbox)

            expect(checkbox.exists()).toBeTruthy();
            expect(checkbox.props().checked).toBeTruthy();
        });

        it('gives the row selected class', () => {
            const row = checkedWrapper.find(TableRow);

            expect(row.props().className?.indexOf('selected')).not.toBe(-1);
        });
    });
});
