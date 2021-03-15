import React from 'react'

const UseTrackingReccomendationForm = (props: Props) => {
    const fetchSubReasons = () => {
        return [
            {id : 0 , displayName : 'סיבה 0'},
            {id : 1 , displayName : 'סיבה10'},
            {id : 2 , displayName : 'גדשגדשגשד 0'}
        ]
    }
    
    return {
        fetchSubReasons
    }
}
    
interface Props {
        
}
    
export default UseTrackingReccomendationForm
