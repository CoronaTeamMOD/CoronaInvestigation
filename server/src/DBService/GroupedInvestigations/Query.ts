import { gql } from 'postgraphile';

export const GET_GROUPED_INVESTIGATIONS_REASONS = gql`
query GetAllGroupedInvestigationsReasons {
  allInvestigationGroupReasons {
    nodes {
    	id
			displayName
    }
  }
}
`;