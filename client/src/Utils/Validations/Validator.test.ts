import Validator from './Validator';

describe('PhoneValidation Tests', () => {

    describe('CellPhone Numbers: ', () => {
        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('050-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('051-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('052-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('053-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('054-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('055-1234561')).toBeTruthy();
        });

        it('Should be true (wrong beginning)', () => {
            expect(Validator.phoneValidation('056-1234561')).toBeFalsy();
        });

        it('Should be false (not long enough)', () => {
            expect(Validator.phoneValidation('050-12561')).toBeFalsy();
        });

        it('Should be false (too long)', () => {
            expect(Validator.phoneValidation('050-123456123')).toBeFalsy();
        });

        it('Should be false (no heifen)', () => {
            expect(Validator.phoneValidation('0501234561')).toBeFalsy();
        });
    });

    describe('HomePhone Numbers: ', () => {
        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('02-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('03-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('04-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('08-1234561')).toBeTruthy();
        });

        it('Should be true (correct start & correct number of digits)', () => {
            expect(Validator.phoneValidation('09-1234561')).toBeTruthy();
        });

        it('Should be false (not long enough)', () => {
            expect(Validator.phoneValidation('02-12561')).toBeFalsy();
        });

        it('Should be false (too long)', () => {
            expect(Validator.phoneValidation('03-123456123')).toBeFalsy();
        });

        it('Should be false (wrong beginning)', () => {
            expect(Validator.phoneValidation('07-1234561')).toBeFalsy();
        });

        it('Should be false (no heifen)', () => {
            expect(Validator.phoneValidation('03123456123')).toBeFalsy();
        });
    });
});
