const filterCreators = {
    SEARCH_BAR: (value: string) => {
        return value.length > 0 ?
        {
            search: {
                or: [
                    { userName: { includes: value } },
                    { id: { includes: value } }
                ]
            }
        } : { search: null };
    },
    SOURCE_ORGANIZATION: (values: string[]) => {
        return values.length > 0 ?
        { 
            sourceOrganization: {
                sourceOrganizationBySourceOrganization: { displayName: { in: values } } 
            } 
        }
        : { sourceOrganization: null };
    },
    LANGUAGES: (values: string[]) => {
        return values.length > 0 ?
        {
            languages: {
                userLanguagesByUserId: {
                    some: { languageByLanguage: { displayName: { in: values } } }
                }
            }
        } : { languages: null };
    },
    COUNTY: (values: string[]) => {
        return values.length > 0 ? 
        {
            county: {
                investigationGroup: { in: values }
            }
        } : { county: null };
    },
    USER_TYPE: (values: string[]) => {
        return values.length > 0 ? 
        { userType: { userType: { in: values } } }
        : { userType: null };  
    },
    USER_STATUS: (values: string[]) => {
        return values.length > 0 ? 
        {
            userStatus: { isActive: { in: values } }
        } : { userStatus: null };
    }
}

export default filterCreators;