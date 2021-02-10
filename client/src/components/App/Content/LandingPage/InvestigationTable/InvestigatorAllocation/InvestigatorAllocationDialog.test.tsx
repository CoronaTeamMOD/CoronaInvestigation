import React from 'react'
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';


import InvestigatorAllocationDialog, { investigatorAllocationTitle } from './InvestigatorAllocationDialog';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';
import { investigators } from 'Utils/Testing/InvestigatorAllocation/state/index';

const fetchInvestigatorsSpy = jest.fn(() => Promise.resolve(investigators));

const contentProps = {
    isOpen: true,
    handleCloseDialog:  jest.fn(),
    fetchInvestigators: fetchInvestigatorsSpy,
    allocateInvestigationToInvestigator: jest.fn(),
    groupIds: [],
    epidemiologyNumbers: [],
    onSuccess:  jest.fn(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false })),
};

let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

beforeAll( async () =>{
    wrapper = await mount(
        <InvestigatorAllocationDialog 
            {...contentProps}
        />
    );
    wrapper.update();
})

describe('<InvestigatorAllocationDialog />', () => {
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows title', () => {
        const title = wrapper.find('div#investigator-allocation-title');
        expect(title.exists()).toBeTruthy();
        expect(title.text()).toBe(investigatorAllocationTitle);
    });

    it('renders cancel button' , () => {
        const cancelButton = wrapper.find('button#cancel-button');
        expect(cancelButton.exists()).toBeTruthy();
    });

    describe('submit button:', () => {
        const submitButton = wrapper.find('button#submit-button');
        it('renders' , () => {
            expect(submitButton.exists()).toBeTruthy();
        });

        it('is disabled' , () => {
            expect(submitButton.props().disabled).toBeTruthy();
        });
        it('is not disabled when row selected' , () => {
            act(() => {
                wrapper.find('tr#investigator-row-206621534').simulate('click');
            });
            expect(submitButton.props().disabled).toBeFalsy();
        });
    });

    it('renders tool tip' , () => {
        const toolTip = wrapper.find('span#tool-tip');
        expect(toolTip.exists()).toBeTruthy();
    });

    it('shows tool tip message' , () => {
        const toolTipMessage = 'לא נבחר חוקר';
        const toolTip = wrapper.find('span#tool-tip');
        expect(toolTip.props().title).toBe(toolTipMessage);
    });
    it('does not show tool tip message when row selected' , () => {
        const toolTip = wrapper.find('span#tool-tip');
        wrapper.find('tr#investigator-row-206621534').invoke('onClick')!({} as any)
            expect(toolTip.props().title).toBeFalsy();
        
    });    

    it('renders InvestigatorsTable' , () => {
        const investigatorsTable = wrapper.find(InvestigatorsTable);
        expect(investigatorsTable.exists()).toBeTruthy();
    });

    // it('triggers search on input', () => {
    //     const query = 'מוטי';
    //     act(() => {
    //         wrapper.find(TypePreventiveTextField).at(0).props().onChange(query);
    //     })
    //     wrapper.update();

    //     expect(wrapper.find(TypePreventiveTextField).at(0).props().value).toBe(query);
    //     const tableRow = wrapper.find('tr#person-row-666');

    //     expect(tableRow.exists()).toBeTruthy();
    //     expect(tableRow).toHaveLength(1);

    //     const noResultsMessage = wrapper.find('h5#errorMessage');
    //     expect(noResultsMessage.exists()).toBeFalsy();
    // });

    // it('triggers search on button click', () => {
    //     const query = 'yonatan';

    //     act(() => {
    //         wrapper.find(TypePreventiveTextField).at(0).props().onChange(query);
    //     });
    //     act(() => {
    //         wrapper.find('button#searchIconButton').simulate('click');
    //     });
    //     wrapper.update();

    //     expect(wrapper.find(TypePreventiveTextField).at(0).props().value).toBe(query);
    //     const tableRow = wrapper.find('tr#person-row-666');

    //     expect(tableRow.exists()).toBeFalsy();

    //     const noResultsMessage = wrapper.find('h5#errorMessage');
    //     expect(noResultsMessage.exists()).toBeTruthy();
    //     expect(noResultsMessage.text()).toBe('אין תוצאות מתאימות');
    // })

    // describe('searches by: ' , () => {
    //     const { identificationNumber , firstName , lastName, phoneNumber} = testPersonalDetails;
    //     const searchableValues = [ identificationNumber, firstName, lastName, phoneNumber];
    //     const searchWrapper = mount(
    //         <MockFormProvider >
    //             <AccordionContent 
    //                 {...contentProps}
    //             />
    //         </MockFormProvider>
    //     )

    //     searchableValues.forEach((value) => {
    //         it(`searches: ${value}` , () => {
    //             act(() => {
    //                 searchWrapper.find(TypePreventiveTextField).at(0).props().onChange(value);
    //             });
    //             act(() => {
    //                 searchWrapper.find('button#searchIconButton').simulate('click');
    //             });
    //             searchWrapper.update();

    //             expect(searchWrapper.find(TypePreventiveTextField).at(0).props().value).toBe(value);
    //             const tableRow = searchWrapper.find('tr#person-row-666');

    //             expect(tableRow.exists()).toBeTruthy();
    //             expect(tableRow).toHaveLength(1);
    //         })
    //     });
    // });
});