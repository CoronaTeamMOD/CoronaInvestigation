import User,{FetchedUser} from './User';

interface InvestigatorOption { 
    id: string;
    value: User; 
}
export interface FetchedInvestigatorOption { 
    id: string;
    value: FetchedUser; 
}

export default InvestigatorOption;