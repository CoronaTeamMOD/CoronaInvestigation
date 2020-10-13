import ResultError from '../ResultError';

interface GetAllSourceOrganizations {
    data?: {
        allSourceOrganizations: {
            nodes: SourceOrganization[]
        }
    },
    errors?: ResultError[]
}

interface SourceOrganization  {
    displayName: string
}

export default GetAllSourceOrganizations;
