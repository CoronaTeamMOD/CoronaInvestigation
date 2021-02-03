import React from 'react'
import { mount } from 'enzyme';
import { Grid } from '@material-ui/core';

import MockFormProvider from 'Utils/Testing/MockFormProvider';
import mockSelectors from 'Utils/Testing/GroupedInvestigationForm/mockSelectors';
import { testEvents } from 'Utils/Testing/GroupedInvestigationForm/state';

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
    const wrapper = mount(
        <MockFormProvider >
            <AccordionContent 
                {...contentProps}
            />
        </MockFormProvider>
    )

    console.log(wrapper.debug());
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
    })
})
