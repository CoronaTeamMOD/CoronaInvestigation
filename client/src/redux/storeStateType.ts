import User from 'models/User';
import City from 'models/City';
import Country from 'models/Country';
import DBAddress from 'models/DBAddress';
import ContactType from 'models/ContactType';
import InvestigationRedux from 'models/InvestigationRedux';

export default interface StoreStateType {
    user: User;
    isLoading: boolean;
    isInInvestigation: boolean;
    investigation: InvestigationRedux;
    gender: string;
    cities: Map<string, City>;
    countries: Map<string, Country>;
    contactTypes: Map<number, ContactType>;
    subStatuses: string[];
    statuses: string[];
    formsValidations: { [key: number]: (boolean | null)[] };
    address: DBAddress;
};
