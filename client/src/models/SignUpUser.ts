import City from './City';
import County from './County';
import Language from './Language';
import SignUpFields from './enums/SignUpFields';

interface FullName {
    [SignUpFields.FIRST_NAME]?: string,
    [SignUpFields.LAST_NAME]?: string,
}

interface SignUpUser {
    [SignUpFields.MABAR_USER_NAME]?: string,
    [SignUpFields.FULL_NAME]?: FullName,
    [SignUpFields.CITY]?: City,
    [SignUpFields.PHONE_NUMBER]?: string,
    [SignUpFields.ID]?: string,
    [SignUpFields.MAIL]?: string,
    [SignUpFields.COUNTY]?: County,
    [SignUpFields.DESK]?: number | null;
    [SignUpFields.SOURCE_ORGANIZATION]?: string,
    [SignUpFields.LANGUAGES]?: Language[]
}

export default SignUpUser;