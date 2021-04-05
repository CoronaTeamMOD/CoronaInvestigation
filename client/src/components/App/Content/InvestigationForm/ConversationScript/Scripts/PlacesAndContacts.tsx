import React from 'react'
import { Typography } from '@material-ui/core'

const PlacesAndContacts = (props: Props) => {
    return (
        <div>
            <Typography>
                <b>הגענו כעת לשלב האחרון, שהוא שלב מאוד משמעותי – מקומות שהייה ואיתור מגעים</b>          
            </Typography>
            <Typography>אבקש ממך להיזכר במקומות בהם היית ואנשים אותם פגשת.</Typography>
            <Typography>דווח/י גם מידע חלקי מכיוון שבהמשך, במידה ותיזכר/י, נוכל להשלימו נסה/י להיזכר בכוחות עצמך</Typography>
            <Typography>אך את/ה יכול/ה גם ואפילו רצוי/ה להיעזר באמצעים טכנולוגיים בטלפון, ביומן, באפליקציות, תמונות, מדיה חברתית, WAZE, כרטיסי אשראי ובכל אמצעי שיוכל לסייע לך להיזכר</Typography>
            <Typography>את/ה יכול/ה גם להיעזר בבני משפחה וחברים</Typography>
            <Typography>אם תרגיש/י שאת/ה זקוק/ה להפסקה, תגיד/י לי</Typography>
            <Typography>אנחנו נתחיל את הרצף מהיום הנוכחי ונלך אחורה 4 / 7 ימים</Typography>
            <Typography>בכל מקום שאת/ה נזכר/ת שהיית בו, נסה/י להיזכר את מי פגשת.</Typography>
            <Typography>דווח/י גם על מחוסנים ומחלימים, זאת לטובת תיעוד, מעקב ובקרה. מחוסנים ומחלימים אינם נדרשים בבידוד. הסר/י דאגה.</Typography>
            <Typography><b>סיכום השיחה</b></Typography>
            <Typography>אני רוצה להודות לך על שיתוף הפעולה, והמאמץ שהשקעת בשיחה שלנו.</Typography>
            <Typography>אם תיזכר/י במקומות ואנשים נוספים, אנא רשום/מי אותם וצור/צרי קשר עם לשכת הבריאות. אנו נדאג לעדכן ולתעד את הנתונים.</Typography>
        </div>
    )
}

interface Props {
    
}

export default PlacesAndContacts;
