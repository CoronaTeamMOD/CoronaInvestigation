import { useState } from 'react';

import { AdminAction } from 'models/AdminAction';
import adminActions, { defaultAdminAction } from 'models/enums/adminActions';

const useAdminAction = () => {
    
    const [selectedAdminAction, setSelectedAdminAction] = useState<AdminAction>(defaultAdminAction);

    const onAdminActionChange = (adminActionId: number) => {
        const selectedAdminAction = adminActions.find(adminAction => adminAction.id === adminActionId) as AdminAction;
        setSelectedAdminAction(selectedAdminAction);
    }

    return {
        onAdminActionChange,
        selectedAdminAction
    }
};

export default useAdminAction;