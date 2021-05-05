import { isOtherIdValid, isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

describe('auxiliaryFunctions', () => {
    
    describe('ID number: ', () => {
        it('should accept' , () => {
            expect(isIdValid('999616717')).toBeTruthy
        })

        it('shouldnt accept - wrong number' , () => {
            expect(isIdValid('123123123')).toBe(false)
        })

        it('shouldnt accept - short number' , () => {
            expect(isIdValid('99961671')).toBe(false)
        })

        it('shouldnt accept - long number' , () => {
            expect(isIdValid('9996167179')).toBe(false)
        })
    });

    describe('Passport number: ', () => {

        it('should accept' , () => {
            expect(isOtherIdValid('3005739')).toBeTruthy
        })

        it('shouldnt accept - wrong number' , () => {
            expect(isOtherIdValid('123123123')).toBe(false)
        })

        it('shouldnt accept - long number' , () => {
            expect(isOtherIdValid('30057391')).toBe(false)
        })

        it('shouldnt accept - short number' , () => {
            expect(isOtherIdValid('300573')).toBe(false)
        })
    });
})