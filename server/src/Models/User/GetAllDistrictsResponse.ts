import ResultError from '../ResultError';

interface GetAllDistrictsResponse {
    data?: {
        allDistricts: {
            nodes: District[]
        }
    },
    errors?: ResultError[]
}

interface District {
    id: number,
    displayName: string
}

export default GetAllDistrictsResponse;
