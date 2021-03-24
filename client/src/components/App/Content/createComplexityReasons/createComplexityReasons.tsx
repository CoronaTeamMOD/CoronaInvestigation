import React from 'react';
import axios from 'axios';

const createComplexityReasons: React.FC = () => {

    const updateInvestigationsComplexityReasons = () => {
        axios.get('/complexityReasons/investigations')
    }

    const updateAgeComplexityReasons = () => {
        axios.get('/complexityReasons/age')

    }

    return (
        <> 
            <button onClick={() => {updateInvestigationsComplexityReasons()} }>
                Click Here for Updating Investigations Complexity Reasons
            </button>

            <button onClick={() => {updateAgeComplexityReasons()} }>
                Click Here for Updating Age Complexity Reason
            </button>
        </>
    )
}
export default createComplexityReasons;