import * as yup from 'yup';
import interactionEventSchema from './ContactQuestioningSchema';

const interactionEventArraySchema = 
     yup.array().of(interactionEventSchema);
      
 
     export default interactionEventArraySchema;