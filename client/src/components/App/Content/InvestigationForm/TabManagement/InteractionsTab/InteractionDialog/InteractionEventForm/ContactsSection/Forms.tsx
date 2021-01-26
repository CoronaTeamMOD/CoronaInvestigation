import React from 'react'

import useFormStyles from 'styles/formStyles';
import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';

import FamilyMembersForm from './FamilyMembers/FamilyMembersForm';
import ManualContactsForm from './ManualContactsForm/ManualContactsForm';
import GroupedInvestigationsTab from './GroupedInvestigations/GroupedInvestigationsTab';

const Forms = (props: Props) => {
    const { currentTab,  groupedInvestigationContacts, setGroupedInvestigationContacts} = props;
    const formClasses = useFormStyles();

    const contactFormTabs = [
        { id: 0, Component: <ManualContactsForm /> },
        { id: 1, Component: <FamilyMembersForm /> },
        { 
            id: 2, 
            Component: <GroupedInvestigationsTab 
                            groupedInvestigationContacts={groupedInvestigationContacts}
                            setGroupedInvestigationContacts={setGroupedInvestigationContacts}
                        />
        }
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
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
}

export default Forms;