import ResultError from '../ResultError';

interface GetAllCountiesResponse {
    data?: {
        allCounties: {
            nodes: County[]
        }
    },
    errors?: ResultError[]
}

interface County  {
    id: number,
    displayName: string
}

export default GetAllCountiesResponse;
