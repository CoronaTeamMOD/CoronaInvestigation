import { isPassportValid, isIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

describe('auxiliaryFunctions', () => {
    it('should accept ID number' , () => {
        expect(isIdValid('999616717')).toBeTruthy
    })

    it('shouldnt accept ID number - wrong number' , () => {
        expect(isIdValid('123123123')).toBe(false)
    })

    it('shouldnt accept ID number - short number' , () => {
        expect(isIdValid('99961671')).toBe(false)
    })

    it('shouldnt accept ID number - long number' , () => {
        expect(isIdValid('9996167179')).toBe(false)
    })

    it('should accept ID number' , () => {
        expect(isPassportValid('3005739')).toBeTruthy
    })

    it('shouldnt accept ID number - wrong number' , () => {
        expect(isPassportValid('123123123')).toBe(false)
    })

    it('shouldnt accept ID number - long number' , () => {
        expect(isPassportValid('30057391')).toBe(false)
    })

    it('shouldnt accept Passport number - short number' , () => {
        expect(isPassportValid('300573')).toBe(false)
    })
})