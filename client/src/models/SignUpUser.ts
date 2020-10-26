import SignUpFields from './enums/SignUpFields';
import Language from './Language';

interface FullName {
    [SignUpFields.FIRST_NAME]?: string,
    [SignUpFields.LAST_NAME]?: string,
}

interface SignUpUser {
    [SignUpFields.MABAR_USER_NAME]?: string,
    [SignUpFields.FULL_NAME]?: FullName,
    [SignUpFields.CITY]?: string ,
    [SignUpFields.PHONE_NUMBER]?: string,
    [SignUpFields.ID]?: string,
    [SignUpFields.MAIL]?: string,
    [SignUpFields.COUNTY]?: number,
    [SignUpFields.DESK]?: number | null | string;
    [SignUpFields.SOURCE_ORGANIZATION]?: string,
    [SignUpFields.LANGUAGES]?: Language[]
}

export default SignUpUser;