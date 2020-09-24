import {gql} from 'postgraphile';

export const GET_IS_USER_ACTIVE = gql`
    query isUserActive($id: String!){
        userById(id: $id) {
            isActive
        }
    }
`;