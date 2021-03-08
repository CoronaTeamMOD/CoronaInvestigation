import District from './District';
import ResultError from '../ResultError';

interface GetAllDistrictsResponse {
    data?: {
        allDistricts: {
            nodes: District[]
        }
    },
    errors?: ResultError[]
}

export default GetAllDistrictsResponse;