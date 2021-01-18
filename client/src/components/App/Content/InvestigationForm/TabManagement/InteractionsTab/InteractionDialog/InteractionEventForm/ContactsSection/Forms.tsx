import React from 'react'

import useFormStyles from 'styles/formStyles';

import FamilyMembersForm from './FamilyMembers/FamilyMembersForm';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';

const contactFormTabs = [
    { id: 0, Component: <ManualContactsForm /> },
    { id: 1, Component: <FamilyMembersForm /> },
];

const Forms = ({ currentTab }: { currentTab: number }) => {
    const formClasses = useFormStyles();

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

export default Forms;