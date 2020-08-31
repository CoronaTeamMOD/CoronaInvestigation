import React, {useState} from 'react';
import { Button } from '@material-ui/core';

import LocationType from 'models/LocationType';
import NewContactDialog from './NewContactDialog/NewContactDialog';

const locations: LocationType[] = [
    {
        name: 'אוטובוס'
    },
    {
        name: 'חנות'
    },
    {
        name: 'קניון'
    }
];

export const ADD_CONTACT = 'צור מקום/מגע חדש';

const ContactsAndExposuresTab: React.FC = () => {
    const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false);

    return (
        <div>
            <Button onClick={() => setIsDialogOpen(true)}>{ADD_CONTACT}</Button>
            <NewContactDialog isDialogOpen={isDialogOpen} allLocationTypes={locations} setDialogOpen={setIsDialogOpen} />
        </div>
    );
}

export default  ContactsAndExposuresTab;