import User from 'models/User';
import City from 'models/City';
import Country from 'models/Country';
import InvestigationRedux from 'models/InvestigationRedux';

export default interface StoreStateType {
    user: User;
    isLoading: boolean;
    investigation: InvestigationRedux;
    gender: string;
    cities: Map<string, City>;
    countries: Map<string, Country>;
    formsValidations: (boolean | null)[];
}
