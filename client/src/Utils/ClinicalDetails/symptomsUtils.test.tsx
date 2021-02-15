import { getDatesToInvestigate, getMinimalSymptomsStartDate, getMinimalStartIsolationDate } from './symptomsUtils'

describe('ClinicalDetails', () => {
    let date: Date = new Date('2021-02-15T06:05:26.497Z');

    it('dont HaveSymptoms, symptomsStartDate and validationDate' , () => {
        expect(getDatesToInvestigate(false,null,null)).toEqual([])
    })

    it('HaveSymptoms, dont have symptomsStartDate and validationDate' , () => {
        expect(getDatesToInvestigate(true,null,null)).toEqual([])
    })

    it('dont HaveSymptoms, have symptomsStartDate, dont validationDate' , () => {
        expect(getDatesToInvestigate(false, date, null)).toEqual([])
    })

    it('HaveSymptoms, dont have symptomsStartDate and have validationDate' , () => {
        expect(getDatesToInvestigate(true ,null ,date)).toEqual([
            new Date('2021-02-14T22:00:00.000Z'),
            new Date('2021-02-13T22:00:00.000Z'),
            new Date('2021-02-12T22:00:00.000Z'),
            new Date('2021-02-11T22:00:00.000Z'),
            new Date('2021-02-10T22:00:00.000Z'),
            new Date('2021-02-09T22:00:00.000Z'),
            new Date('2021-02-08T22:00:00.000Z'),
            new Date('2021-02-07T22:00:00.000Z'),
        ])
    })

    it('HaveSymptoms, symptomsStartDate and validationDate are the same date' , () => {
        expect(getDatesToInvestigate(true ,date ,date)).toEqual([
            new Date('2021-02-14T22:00:00.000Z'),
            new Date('2021-02-13T22:00:00.000Z'),
            new Date('2021-02-12T22:00:00.000Z'),
            new Date('2021-02-11T22:00:00.000Z'),
            new Date('2021-02-10T22:00:00.000Z'),
        ])
    })
})