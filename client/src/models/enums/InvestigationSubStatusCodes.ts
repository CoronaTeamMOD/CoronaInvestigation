enum InvestigationSubStatusCodes {
HOSPITALIZED = 'המטופל מאושפז',
DECEASED = 'המטופל נפטר',
UNCOOPERATIVE = 'חוסר שיתוף פעולה',
RETURNED_FROM_ABROAD = 'חזר לחול',
PHONE_NUMBER_MISSING = 'חסר טלפון',
PATIENT_DETAILS_MISSING = 'חסרים פרטי מטופל',
PHONE_UNAVAILABLE = 'טלפון לא זמין',
UNTRACEABLE = 'לא ניתן לאיתור',
WAITING_FOR_DETAILS = 'מחכה להשלמת פרטים',
WAITING_FOR_RESPONSE = 'מחכה למענה',
REQUESTED_ANOTHER_TIME = 'מטופל מבקש לצלצל אליו בזמן אחר',
TRANSFER_REQUEST = 'נדרשת העברה',
}

export default InvestigationSubStatusCodes;