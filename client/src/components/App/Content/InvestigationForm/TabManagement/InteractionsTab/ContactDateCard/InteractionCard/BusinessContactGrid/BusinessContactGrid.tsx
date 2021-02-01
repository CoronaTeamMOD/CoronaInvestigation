import React from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionGridItem from '../PlacesAdditionalGrids/InteractionGridItem';

const businessContactFirstNameField = 'שם איש קשר';
const businessContactNumField = 'טלפון איש קשר';
 
const BusinessContactGrid : React.FC<Props> = (props: Props) : JSX.Element => { 
    const { interaction } = props;
    
    return (
        <>
            {   (interaction.contactPersonFirstName && interaction.contactPersonLastName) &&
                    <InteractionGridItem 
                        containerSize={6}
                        labelLengthMD={3}
                        labelLengthLG={2}
                        title={businessContactFirstNameField}
                        content={`${interaction.contactPersonFirstName} ${interaction.contactPersonLastName}`}
                    />
            }
            {
                (interaction.contactPersonPhoneNumber && interaction.contactPersonPhoneNumber) &&
                    <InteractionGridItem 
                        containerSize={6}
                        labelLengthMD={3}
                        labelLengthLG={2}
                        title={businessContactNumField}
                        content={interaction.contactPersonPhoneNumber}
                    />
            }
        </>
    );
};

export default BusinessContactGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
