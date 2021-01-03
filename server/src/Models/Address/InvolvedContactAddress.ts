import City from './City';
import Street from './Street';

interface InvolvedContactAddress {
    city: City;
    street: Street;
    floor: string;
    houseNum: string;
}

export default InvolvedContactAddress;
