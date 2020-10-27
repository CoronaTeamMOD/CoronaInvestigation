
const filterCreators = {
    SOURCE_ORGANIZATION: {
        create(values: string[]) {
            return values.length > 0 ?
            {
                sourceOrganizationBySourceOrganization: { displayName: { in: values } }
            } : { sourceOrganizationBySourceOrganization: null };
        }
    },
    LANGUAGES: {
        create(values: string[]) {
            return values.length > 0 ?
            {
                userLanguagesByUserId: {
                    some: { languageByLanguage: { displayName: { in: values } } }
                  }
            } : { userLanguagesByUserId: null };
        }
    },
    COUNTY: {
        create(values: string[]) {
            return values.length > 0 ? 
            {
                investigationGroup: { in: values }
            } : { investigationGroup: null };
        }
    },
    USER_TYPE: {
        create(values: string[]) {
            return values.length > 0 ? 
            {
                userType: { in: values }
            } : { userType: null };
        }
    },
    USER_STATUS: {
        create(values: string[]) {
            return values.length > 0 ? 
            {
                isActive: { in: values }
            } : { isActive: null };
        }
    }
}

export default filterCreators;