import React from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';

const PrivateHouseEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;

    return (
        <>
            <AddressGrid interaction={interaction}/>
        </>
    );
};

export default PrivateHouseEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}