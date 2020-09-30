export default interface CoronaTestDateQueryResult {
    data: {
        allInvestigations: {
            nodes: [{
                coronaTestDate: string,
                startTime: string,
            }]
        }
    }
}