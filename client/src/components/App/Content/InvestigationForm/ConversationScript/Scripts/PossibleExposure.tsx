import React from 'react'
import { Typography } from '@material-ui/core'

const PossibleExposure = (props: Props) => {
    return (
        <div>
            <Typography>
                <b>נעבור כעת לשלב השלישי: </b>
                מקור החשיפה לנגיף            
            </Typography>
            <Typography>
                בחלק זה אנחנו לא מחפשים אשמים, אלא מנסים להבין את הדרך בה הנגיף מתפשט. ככל שנדע כיצד הנגיף מתפשט כך גם נוכל למנוע ממנו להמשיך ולפגוע בנו.
            </Typography>
        </div>
    )
}

interface Props {
    
}

export default PossibleExposure;
