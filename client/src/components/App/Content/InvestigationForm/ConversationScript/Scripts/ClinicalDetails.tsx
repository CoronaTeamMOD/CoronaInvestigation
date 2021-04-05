import React from 'react'
import { Typography } from '@material-ui/core'

const PersonalDeatils = (props: Props) => {
    return (
        <div>
            <Typography>
                <b>נעבור כעת לשלב השני: </b>
                מידע רפואי ואחר (במידה ומבקש/ת הסבר ניתן להוסיף שמטרתו: הבנה טובה יותר של התנהגות הנגיף, וההתמודדות איתו.)
            </Typography>
        </div>
    )
}

interface Props {
    
}

export default PersonalDeatils
