import ResultError from '../ResultError';

interface GetAllUserTypesResponse {
    data?: {
        allUserTypes: {
          nodes: UserType[]
        }
    },
    errors?: ResultError[]
}

interface UserType  {
    displayName: string,
    id: number
}

export default GetAllUserTypesResponse;