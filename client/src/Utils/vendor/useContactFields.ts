import React from 'react';
import InteractedContact from 'models/InteractedContact';

const COMPLETE_STATUS = 5;
const useContactFields = (contactStatus?: InteractedContact['contactStatus']) => {
    const isFieldDisabled = React.useMemo(() => contactStatus === COMPLETE_STATUS, [contactStatus]);

    return {
        isFieldDisabled
    }
};

export default useContactFields;