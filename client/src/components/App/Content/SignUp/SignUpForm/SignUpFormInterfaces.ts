import County from 'models/County';

export interface useSignUpFormParameters {
    setCounties: React.Dispatch<React.SetStateAction<County[]>>;
}