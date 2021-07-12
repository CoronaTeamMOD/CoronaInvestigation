
import { useSelector } from 'react-redux';

import GroupedInteractedContact, { GroupedInteractedContactEvent } from 'models/ContactQuestioning/GroupedInteractedContact';

import StoreStateType from 'redux/storeStateType';
//


const contacQuestioningData = () => {
 //  const interactedContacts = useSelector<StoreStateType,GroupedInteractedContact[]>(state=>state.interactedContacts.interactedContacts);
    

  const validateIdentityData = (id:number,identityType:number,identityNumber:string)=>{
    //  const duplicate =interactedContacts.filter (contact=>{
    //     return id!==contact.id && identityType===contact.identificationType.id && identityNumber===contact.identificationNumber;
    //  })
    //  return duplicate.length == 0;

  } 
 return {validateIdentityData};

}


    export default contacQuestioningData;
