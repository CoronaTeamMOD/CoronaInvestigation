enum SelfInvestigaionStatuses {
    UNOPENED = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2
}

export const getInvestigationStatusName = (status : number) => {
    switch(status) {
        case SelfInvestigaionStatuses.UNOPENED :
            return 'לא נפתח'
        case SelfInvestigaionStatuses.IN_PROGRESS :
            return 'בתהליך'
        case SelfInvestigaionStatuses.COMPLETED :
            return 'הושלם'
        default : 
            return 'לא ידוע'
    }
}

export default SelfInvestigaionStatuses