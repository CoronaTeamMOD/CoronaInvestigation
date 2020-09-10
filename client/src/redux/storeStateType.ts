import User from 'models/User';
import InvestigationRedux from 'models/InvestigationRedux';
import City from 'models/City';

export default interface StoreStateType {
    user: User;
    isLoading: boolean;
    investigation: InvestigationRedux;
    gender: string;
    cities: Map<string, City>
}
