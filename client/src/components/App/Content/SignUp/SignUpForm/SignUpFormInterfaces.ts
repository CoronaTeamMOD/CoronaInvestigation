import Desk from 'models/Desk';

export interface useSignUpFormParameters {
    setDesks: React.Dispatch<React.SetStateAction<Desk[]>>;
}