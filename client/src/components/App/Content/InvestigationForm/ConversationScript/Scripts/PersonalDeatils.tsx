import React from 'react'
import { Typography } from '@material-ui/core'

const PersonalDeatils = (props: Props) => {
    return (
        <div>
            <Typography>שלום, שמי... אני חוקר מטעם מערך החקירות האפידמיולוגיות של משרד הבריאות.</Typography>
            <Typography>האם אני מדבר/ת עם _____ -</Typography>
            <ul>
                <li><Typography>כן - <i>להמשיך</i></Typography></li>
                <li><Typography>לא - לבקש לדבר איתו.</Typography></li>
            </ul>
            <Typography>מה שלומך? איך את/ה מרגיש/ה?</Typography>
            <Typography>אני רוצה לוודא שאת/ה יכול/ה להקדיש מזמנך ושיש לך מקום שקט לקיים את השיחה</Typography>
            <Typography>אני אשאל פרטים אישיים, מקומות שהיית בהם בימים האחרונים ואנשים שפגשת והיית איתם במגע קרוב.</Typography>
            <Typography>אני מודה לך על שיתוף הפעולה. כך את/ה מגן/ה על בני משפחתך ושאר הקרובים והסובבים אותך. את/ה מסייע/ת לשמר חיי שגרה ומניעת הגבלות על פעילות המשק והחברה.</Typography>
            <Typography>לשיחה שנקיים יהיו 4 שלבים</Typography>
            <Typography>
                <b>נתחיל בשלב הראשון: </b>
                אימות פרטים אישיים.
            </Typography>
        </div>
    )
}

interface Props {
    
}

export default PersonalDeatils
