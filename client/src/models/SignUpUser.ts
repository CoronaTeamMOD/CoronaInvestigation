import City from './City';
import Desk from './Desk';
import County from './County';
import Language from './Language';
import Authority from './Authority';
import SignUpFields from './enums/SignUpFields';

interface FullName {
    [SignUpFields.FIRST_NAME]?: string,
    [SignUpFields.LAST_NAME]?: string,
};

interface SignUpUser {
    [SignUpFields.MABAR_USER_NAME]?: string,
    [SignUpFields.FULL_NAME]?: FullName,
    [SignUpFields.CITY]?: City,
    [SignUpFields.PHONE_NUMBER]?: string,
    [SignUpFields.ID]?: string,
    [SignUpFields.MAIL]?: string,
    [SignUpFields.COUNTY]?: County,
    [SignUpFields.DESK]?: Desk,
    [SignUpFields.SOURCE_ORGANIZATION]?: string,
    [SignUpFields.LANGUAGES]?: Language[],
    [SignUpFields.AUTHORITY]?: Authority,
};

export default SignUpUser;