import ResultError from '../ResultError';

interface GetAllLanguagesResponse {
    data?: {
        allLanguages: {
            nodes: Language[]
        }
    },
    errors?: ResultError[]
}

export interface Language  {
    displayName: string
}

export default GetAllLanguagesResponse;
