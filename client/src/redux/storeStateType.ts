import User from 'models/User';
import City from 'models/City';
import InvestigationRedux from 'models/InvestigationRedux';

export default interface StoreStateType {
    user: User;
    isLoading: boolean;
    investigation: InvestigationRedux;
    gender: string;
    cities: Map<string, City>;
}
