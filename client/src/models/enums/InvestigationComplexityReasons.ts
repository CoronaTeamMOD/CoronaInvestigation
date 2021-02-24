enum InvestigationComplexityReasons {
    IS_DECEASED = 'המטופל נפטר',
    IS_CURRENTLY_HOSPITIALIZED = 'מטופל באושפז',
    FAILD_REGISTRATION = 'אימות מרשם נכשל',
    ELSE = 'אחר',
    EDUCATION_SYSTEM = 'מערכת החינוך',
    HEALTH_SYSTEM_EMPLOYEE = 'עובד מערכת הבריאות',
    AGE_UNDER_14 = 'גיל בחקירה מתחת ל14',
    PATIENT_STAYES_IN_INSTITUTION = 'מטופל שוהה במוסד',
    STATUSLESS_PATIRNT = 'מטופל חסר מעמד',
}

export default InvestigationComplexityReasons;