import React from 'react'
import { Typography } from '@material-ui/core'

const ContactQuestioning = (props: Props) => {
    return (
        <div>
            <Typography>לפני יצירת קשר עם המגע, וודא/י שיש לך את כל הנתונים הנדרשים:</Typography>
            <ul>
                <li><Typography>תאריך ומקום החשיפה</Typography></li>
                <li><Typography>מספר ימי הבידוד הנדרשים (המערכת מחשבת אוטומטית את תאריכי הבידוד)</Typography></li>
            </ul>
            <Typography>שיחה עם המגע:</Typography>
            <Typography>שלום, שמי... אני חוקר/ת מטעם מערך החקירות האפידמיולוגיות של משרד הבריאות.</Typography>
            <Typography>האם אני מדבר עם_____.</Typography>
            <ul>
                <li><Typography>כן – להמשיך</Typography></li>
                <li><Typography>לא – לבקש לדבר איתו.</Typography></li>
            </ul>
            <Typography>על פי המידע שיש בידינו, היית במגע עם 'מאומת קורונה' בתאריך_____, במקום (מקום החשיפה) _____,</Typography>
            <Typography>מה שלומך? איך את/ה מרגיש/ה?</Typography>
            <Typography>אני רוצ/ה לוודא שאת/ה יכול/ה להקדיש מזמנך ושיש לך מקום שקט לקיים את השיחה</Typography>
            <Typography>אני מודה לך על שיתוף הפעולה. כך את/ה מגן/ה על בני משפחתך ושאר הקרובים והסובבים אותך. את/ה מסייע/ת לשמר חיי שגרה ומניעת הגבלות על פעילות המשק והחברה.</Typography>
            <Typography>
                נתחיל בפרטים אישיים...
                <i>מעבר על הטופס ומילוי כלל הפרטים הנדרשים. התחל/י בת.ז.!</i>
            </Typography>
            <Typography>האם את/ה מחוסן/ת?.</Typography>
            <Typography>
            <ul>
                <li><Typography>כן - זאת לטובת תיעוד, מעקב ובקרה. מחוסנים ומחלימים אינם נדרשים בבידוד. הסר/י דאגה</Typography></li>
                <li>
                    <Typography>
                        <b>לא - </b>
                        <i>הנחה את המגע להיכנס לבידוד</i>
                        כיוון שהיית במגע עם מאומת עליך להיות בבידוד עד תאריך ____.
                    </Typography>
                </li>
                <li><Typography>במידת הצורך הבע אמפטיה לקושי בכניסה לבידוד</Typography></li>
                <li><Typography>וודא/י כי המגע יכול לקיים בידוד</Typography></li>
                <li><Typography>הפנה/י את המגע לסרטי הסברה בנושא חיסונים.</Typography></li>
                <li><i>עודד/י את המגע לביצוע בדיקת קורונה</i></li>
            </ul>
            </Typography>
            <Typography><b>סיכום השיחה</b></Typography>
            <Typography>אני רוצה להודות לך על שיתוף הפעולה, והמאמץ שהשקעת בשיחה שלנו. סיכמנו על כניסה לבידוד במקום ______, עד לתאריך _____ כולל.</Typography>
            <Typography>עליך לבצע בדיקת קורונה בכל שאלה בנושא הבידוד אפשר לפנות לטלפון 5400*. במידה ותרגיש/י לא טוב במהלך הבידוד, פנה לרופא המטפל או למוקד הקופה.</Typography>
        </div>
    )
}

interface Props {
    
}

export default ContactQuestioning;
