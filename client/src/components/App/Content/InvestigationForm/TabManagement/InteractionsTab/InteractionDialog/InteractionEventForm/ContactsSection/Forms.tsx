import React from 'react'

import useFormStyles from 'styles/formStyles';

import ContactsBankForm from './ContactsBank/ContactsBankForm';
import FamilyMembersForm from './FamilyMembers/FamilyMembersForm';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';
import GroupedInvestigationsTab from './GroupedInvestigations/GroupedInvestigationsTab';

const Forms = (props: Props) => {
    const { currentTab } = props;
    const formClasses = useFormStyles();

    const contactFormTabs = [
        { id: 0, Component: <ManualContactsForm /> },
        { id: 1, Component: <FamilyMembersForm /> },
        { id: 2, Component: <GroupedInvestigationsTab /> },
        { id: 3, Component: <ContactsBankForm /> }
    ];

    return (
        <>
            {contactFormTabs.map(tab =>
                <div className={currentTab !== tab.id ? formClasses.hidden : formClasses.formSize}>
                    {tab.Component}
                </div>
            )}
        </>
    )
};

interface Props {
    currentTab: number;
}

export default Forms;