import React from 'react';
import Swal from 'sweetalert2';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';

import { investigators, confirmedAlert, dismissedAlert } from 'Utils/Testing/InvestigatorAllocation/state/index';

import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';
import InvestigatorAllocationDialog, { investigatorAllocationTitle } from './InvestigatorAllocationDialog';

const handleCloseDialogSpy = jest.fn();
const fetchInvestigatorsSpy = jest.fn(() => Promise.resolve(investigators));
const allocateInvestigationToInvestigatorSpy = jest.fn();
const onSuccessSpy = jest.fn(() => Promise.resolve(confirmedAlert));

const contentProps = {
    isOpen: true,
    handleCloseDialog: handleCloseDialogSpy,
    fetchInvestigators: fetchInvestigatorsSpy,
    allocateInvestigationToInvestigator: allocateInvestigationToInvestigatorSpy,
    groupIds: [],
    epidemiologyNumbers: [],
    onSuccess: onSuccessSpy,
};

let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
const fulshPromises = () => new Promise(setImmediate);

const loadWrapper = async () => {
    await act(async () => {
        wrapper = mount(
            <InvestigatorAllocationDialog 
                {...contentProps}
            />
        );
        await fulshPromises();
    })
    wrapper.update();
};

describe('<InvestigatorAllocationDialog />', () => {
    beforeAll(loadWrapper);
    afterEach(loadWrapper);
    
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows title', () => {
        const title = wrapper.find('div#investigator-allocation-title');
        expect(title.exists()).toBeTruthy();
        expect(title.text()).toBe(investigatorAllocationTitle);
    });
    
    describe('Cancel Btn:', () => {
        beforeAll(loadWrapper);
        afterEach(loadWrapper);
        const cancelButtonSelector = 'button#cancel-button';

        it('renders' , () => {
            expect(wrapper.find(cancelButtonSelector).exists()).toBeTruthy();
        });

        it('runs closeDialog when clicked' , () => {
            act(() => {
                wrapper.find(cancelButtonSelector).simulate('click');  
            });
            wrapper.update();    
            expect(handleCloseDialogSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Submit Btn:', () => {
        beforeAll(loadWrapper);
        afterEach(loadWrapper);
        const submitButtonSelector = 'button#submit-button';

        it('renders' , () => {
            expect(wrapper.find(submitButtonSelector).exists()).toBeTruthy();
        });

        it('is disabled' , () => {
            expect(wrapper.find(submitButtonSelector).props().disabled).toBeTruthy();
        });

        it('is not disabled when row selected' , () => {
            expect(wrapper.find(submitButtonSelector).props().disabled).toBeTruthy();
            act(() => {
                wrapper.find('tr#investigator-row-206621534').simulate('click');  
            });
            wrapper.update()
            expect(wrapper.find(submitButtonSelector).props().disabled).toBeFalsy();
        });
    });

    describe('Tooltip:' , () => {
        beforeAll(loadWrapper);
        afterEach(loadWrapper);
        const tooltipSelector = 'span#tool-tip';

        it('renders' , () => {
            expect(wrapper.find(tooltipSelector).exists()).toBeTruthy();
        });
    
        it('shows message' , () => {
            const toolTipMessage = 'לא נבחר חוקר';
            expect(wrapper.find(tooltipSelector).props().title).toBe(toolTipMessage);
        });
    
        it('does not show message when row selected' , () => {
            expect(wrapper.find(tooltipSelector).props().title).toBeTruthy();
            act(() => {
                wrapper.find('tr#investigator-row-206621534').simulate('click')
            })
            wrapper.update();
            expect(wrapper.find(tooltipSelector).props().title).toBeFalsy();
        });   
    });

    it('renders InvestigatorsTable' , () => {
        const investigatorsTable = wrapper.find(InvestigatorsTable);
        expect(investigatorsTable.exists()).toBeTruthy();
    });

    describe('Alert:', () => {
        beforeAll(loadWrapper);
        afterEach(loadWrapper);

        it('shows alert dismissed', async () => {
            const mockWarning = jest.fn(() => Promise.resolve(dismissedAlert));
            jest.spyOn(Swal, 'fire').mockImplementation(mockWarning);
            expect(mockWarning).not.toBeCalled();
            expect(onSuccessSpy).not.toBeCalled();
            expect(allocateInvestigationToInvestigatorSpy).not.toBeCalled();
            act(() => {
                wrapper.find('tr#investigator-row-206621534').simulate('click');
            });
            await act(async () => {
                wrapper.find('button#submit-button').simulate('click');  
                await fulshPromises();
            });
            wrapper.update();
            expect(mockWarning).toBeCalled();
            expect(onSuccessSpy).not.toBeCalled();
            expect(allocateInvestigationToInvestigatorSpy).not.toBeCalled();
        });

        it('shows alert confirmed', async () => {
            const mockWarning = jest.fn(() => Promise.resolve(confirmedAlert));
            jest.spyOn(Swal, 'fire').mockImplementation(mockWarning);
            expect(mockWarning).not.toBeCalled();
            expect(onSuccessSpy).not.toBeCalled();
            expect(allocateInvestigationToInvestigatorSpy).not.toBeCalled();
            act(() => {
                wrapper.find('tr#investigator-row-206621534').simulate('click');
            });
            await act(async () => {
                wrapper.find('button#submit-button').simulate('click');  
                await fulshPromises();
            });
            wrapper.update();
            expect(mockWarning).toBeCalled();
            expect(onSuccessSpy).toBeCalled();
            expect(allocateInvestigationToInvestigatorSpy).toBeCalledWith([] , [] , investigators[0]);
        });
    });
});