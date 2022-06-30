interface RulesConfig {
    key: string;
    value?: JSON;
    description?: string;
}

export interface RuleConfigRedux {
    settingsForStatusValidity? : JSON;
    ifContactsNeedIsolation? : boolean;
}

export default RulesConfig;