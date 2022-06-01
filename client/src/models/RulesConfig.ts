interface RulesConfig {
    key: string;
    value?: JSON;
    description?: string;
}

export interface RuleConfigRedux {
    ifContactsNeedIsolation? : boolean;
    ifInvestigatedPatientNeedsIsolation? : boolean; 
}

export default RulesConfig;