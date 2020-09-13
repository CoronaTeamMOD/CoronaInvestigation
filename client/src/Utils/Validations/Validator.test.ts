import Validator from './Validator';

describe('Validation Tests', () => {
    describe('PhoneValidation Tests', () => {

        describe('CellPhone Numbers: ', () => {
            it('Should be true (correct start & correct number of digits)', () => {
                expect(Validator.phoneValidation('0503234561')).toBeTruthy();
            });

            it('Should be true (correct start & correct number of digits)', () => {
                expect(Validator.phoneValidation('0517234561')).toBeTruthy();
            });

            it('Should be false (correct start & correct invalid number of digits)', () => {
                expect(Validator.phoneValidation('0771234561')).toBeFalsy();
            });

            it('Should be true (correct start & correct number of digits)', () => {
                expect(Validator.phoneValidation('0779234561')).toBeTruthy();
            });

            it('Should be false (incorrect start & correct valid number of digits)', () => {
                expect(Validator.phoneValidation('0573234561')).toBeFalsy();
            });

            it('Should be true (correct start & correct number of digits)', () => {
                expect(Validator.phoneValidation('088234561')).toBeTruthy();
            });

            it('Should be false (letter in start)', () => {
                expect(Validator.phoneValidation('05a2223561')).toBeFalsy();
            });

            it('Should be false (too long)', () => {
                expect(Validator.phoneValidation('050323456123')).toBeFalsy();
            });

            it('Should be false (too short)', () => {
                expect(Validator.phoneValidation('050423456')).toBeFalsy();
            });
        });
    });
});
