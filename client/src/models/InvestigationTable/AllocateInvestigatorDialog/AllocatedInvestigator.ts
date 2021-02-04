import User from '../../User';

interface AllocatedInvestigator extends Omit<User , 'deskByDeskId'> {
    deskid?: number;
} 

export default AllocatedInvestigator;