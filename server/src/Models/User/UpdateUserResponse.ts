import ResultError from '../ResultError';

interface UpdateUserResponse {
    data?: {
        updateUserById: {
            clientMutationId: number
        }
    },
    errors?: ResultError[]
};

export default UpdateUserResponse;