import React from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import InteractionGridItem from './InteractionGridItem';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const HospitalEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;

    return (
        <>
            <InteractionGridItem 
                containerSize={6}
                labelLengthMD={3}
                labelLengthLG={2}
                title='שם בית חולים'
                content={interaction.placeName}
            />
            <InteractionGridItem 
                containerSize={6}
                labelLengthMD={3}
                labelLengthLG={2}
                title='מחלקה'
                content={interaction.hospitalDepartment}
            />
            <AddressGrid interaction={interaction} />
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default HospitalEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}