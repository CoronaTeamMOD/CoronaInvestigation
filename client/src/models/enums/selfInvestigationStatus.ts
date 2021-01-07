enum SelfInvestigaionStatuses {
    UNOPENED = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2
}

export const statusNames : {[key in SelfInvestigaionStatuses]: string} = {
    [SelfInvestigaionStatuses.UNOPENED] : 'לא נפתח',
    [SelfInvestigaionStatuses.IN_PROGRESS] : 'בתהליך',
    [SelfInvestigaionStatuses.COMPLETED] : 'הושלם'
}

export default SelfInvestigaionStatuses 