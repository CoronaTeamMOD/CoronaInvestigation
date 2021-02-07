import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const repetitiveFieldTools = (interactionIndex?: number) => {

   const generateFieldName = (fieldName: string) => {
       return interactionIndex !== undefined
           ? `${InteractionEventDialogFields.ADDITIONAL_OCCURRENCES}[${interactionIndex}].${fieldName}`
           : fieldName;
   };

    return {
        generateFieldName,
    }
};

export default repetitiveFieldTools;