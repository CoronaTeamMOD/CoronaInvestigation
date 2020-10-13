import ResultError from "../ResultError";

interface CreateUserResponse {
    data?: {
        createNewUser: {
            clientMutationId: number
        }
    },
    errors?: ResultError[]
}

export default CreateUserResponse;
