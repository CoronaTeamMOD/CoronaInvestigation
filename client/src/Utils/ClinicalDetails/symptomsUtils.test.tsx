import { subDays, eachDayOfInterval, compareDesc } from 'date-fns';
import { getDatesToInvestigate } from 'Utils/ClinicalDetails/symptomsUtils';

    describe('getDatesToInvestigate tests:', () => {
        const investigationStartDate = new Date();
        let validationDate = new Date();
        let symptomsStartDate = new Date();
        beforeAll(async () => {
            validationDate = subDays(validationDate, 3);
            symptomsStartDate= subDays(symptomsStartDate, 5);
        });
            it('HaveSymptoms, symptomsStartDateand and validationDate', async () => {
                expect(getDatesToInvestigate(true, symptomsStartDate, validationDate)).toEqual(eachDayOfInterval({start: subDays(symptomsStartDate, 4), end: investigationStartDate}).sort(compareDesc));
            })

            it('HaveSymptoms and validationDate', async () => {
                expect( getDatesToInvestigate(true, null, validationDate)).toEqual(eachDayOfInterval({start: subDays(validationDate, 7), end: investigationStartDate}).sort(compareDesc));
            });

            it('asymptomatic with validationDate', async () => {
                expect(getDatesToInvestigate(false, null, validationDate)).toEqual(eachDayOfInterval({start: subDays(validationDate, 7), end: investigationStartDate}).sort(compareDesc));
            });

            it('asymptomatic, dont have symptomsStartDate and validationDate', async () => {
                expect(getDatesToInvestigate(false, null, null)).toEqual([]);
            });

            it('HaveSymptoms, dont have symptomsStartDate and validationDate', async () => {
                expect(getDatesToInvestigate(true, null, null)).toEqual([]);
            });

            it('HaveSymptoms and symptomsStartDate, dont have validationDate', async () => {
                expect(getDatesToInvestigate(true, symptomsStartDate, null)).toEqual([]);
            });
    });