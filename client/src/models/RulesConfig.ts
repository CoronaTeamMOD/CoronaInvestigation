interface RulesConfig {
    key: string;
    value?: JSON;
    description?: string;
}

export interface RuleConfigRedux {
    ifContactsNeedIsolation? : boolean;
}

export default RulesConfig;