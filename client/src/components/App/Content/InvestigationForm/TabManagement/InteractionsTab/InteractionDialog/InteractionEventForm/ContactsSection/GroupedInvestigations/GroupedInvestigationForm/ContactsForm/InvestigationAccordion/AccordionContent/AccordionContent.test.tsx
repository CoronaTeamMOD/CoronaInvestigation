import React from 'react'
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
//import { TableRow } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { testEvents, testPersonalDetails } from 'Utils/Testing/GroupedInvestigationForm/state';

import AccordionContent from './AccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import TableSearchBar from './TableSearchBar/TableSearchBar';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const contentProps = {
    isGroupReasonFamily: false,
    events: testEvents
}

describe('<AccordionContent />', () => {
    mockSelectors();
    let wrapper = mount(
        <MockFormProvider >
            <AccordionContent 
                {...contentProps}
            />
        </MockFormProvider>
    )

    //console.log(wrapper.debug());
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('renders Grid appropriately', () => {
        const gridContainer = wrapper.find('div#content-container');
        
        expect(gridContainer.exists()).toBeTruthy()
        expect(gridContainer).toHaveLength(1);

        const gridItems = gridContainer.find('.MuiGrid-item.MuiGrid-grid-xs-12');

        expect(gridItems).toHaveLength(3);
    });

    it('renders SearchBar' , () => {
        const searchBar = wrapper.find(TableSearchBar);

        expect(searchBar.exists()).toBeTruthy();
    })

    it('renders ContactsTable' , () => {
        const contactsTable = wrapper.find(ContactsTable);

        expect(contactsTable.exists()).toBeTruthy();
    })

    it('renders SelectedRowsMessage' , () => {
        const selectedRowsMessage = wrapper.find(SelectedRowsMessage);

        expect(selectedRowsMessage.exists()).toBeTruthy();
    });

    it('doesnt trigger search on input', () => {
        const query = 'מוטי';
        act(() => {
            wrapper.find(TypePreventiveTextField).at(0).props().onChange(query);
        })
        wrapper.update();

        expect(wrapper.find(TypePreventiveTextField).at(0).props().value).toBe(query);
        const tableRow = wrapper.find('tr#person-row-666');

        expect(tableRow.exists()).toBeTruthy();
        expect(tableRow).toHaveLength(1);
    });

    it('triggers search on button click', () => {
        const query = 'yonatan';

        act(() => {
            wrapper.find(TypePreventiveTextField).at(0).props().onChange(query);
            wrapper.find('button#searchIconButton').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(TypePreventiveTextField).at(0).props().value).toBe(query);
        const tableRow = wrapper.find('tr#person-row-666');

        expect(tableRow.exists()).toBeFalsy();
    })

    describe('searches by: ' , () => {
        const { identificationNumber , firstName , lastName, phoneNumber, identificationType} = testPersonalDetails;
        const searchableValues = [ identificationNumber, firstName, lastName, phoneNumber, identificationType];
        const searchWrapper = mount(
            <MockFormProvider >
                <AccordionContent 
                    {...contentProps}
                />
            </MockFormProvider>
        )

        it('firstname', () => {
            searchableValues.forEach((value) => {
                act(() => {
                    searchWrapper.find(TypePreventiveTextField).at(0).props().onChange(value);
                    searchWrapper.find('button#searchIconButton').simulate('click');
                });
                searchWrapper.update();
        
                expect(searchWrapper.find(TypePreventiveTextField).at(0).props().value).toBe(value);
                const tableRow = searchWrapper.find('tr#person-row-666');
                if(value === identificationType){
                    console.log(searchWrapper.debug());
                }
                expect(tableRow.exists()).toBeTruthy();
                expect(tableRow).toHaveLength(1);
            })
        });
    });
})
