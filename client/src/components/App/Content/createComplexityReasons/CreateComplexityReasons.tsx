import React from 'react';
import axios from 'axios';

const createComplexityReasons: React.FC = () => {

    const updateInvestigationsComplexityReasons = () => {
        axios.get('/complexityReasons/investigations')
    }

    return (
        <> 
            <button onClick={() => {updateInvestigationsComplexityReasons()} }>
                Click Here for Updating Investigations Complexity Reasons
            </button>
        </>
    )
}
export default createComplexityReasons;