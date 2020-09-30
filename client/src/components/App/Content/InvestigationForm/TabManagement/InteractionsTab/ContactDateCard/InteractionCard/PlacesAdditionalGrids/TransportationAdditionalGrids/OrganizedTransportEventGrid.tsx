import React from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import BusinessContactGrid from '../../BusinessContactGrid/BusinessContactGrid';

const OrganizedTransportEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <BusinessContactGrid interaction={interaction}/>
    );
};

export default OrganizedTransportEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}