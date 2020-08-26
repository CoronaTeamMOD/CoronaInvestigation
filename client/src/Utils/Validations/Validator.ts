

const cellPhoneNumberRegex = /^(050|051|052|053|054|055)-[0-9]{7}$/;
const homePhoneNumberRegex = /^(02|03|04|08|09)-[0-9]{7}$/;

const check = /[0-9]{1,1}/g;

const phoneValidation = (phoneNumber: string) => {
    return cellPhoneNumberRegex.test(phoneNumber) || homePhoneNumberRegex.test(phoneNumber);
}

const Validator = {
    phoneValidation
}

export default Validator;