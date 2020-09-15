const IsraelPhoneNumberRegEx = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/

const phoneValidation = (phoneNumber: string) => {
    return IsraelPhoneNumberRegEx.test(phoneNumber);
}

const formValidation = (form: any): boolean => {
    return Object.values(form).some((value: any) => value && value.isValid === false)
}

const Validator = {
    phoneValidation,
    formValidation
}

export default Validator;
