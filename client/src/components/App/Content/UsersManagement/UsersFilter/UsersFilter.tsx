import React from 'react';
import { useSelector } from 'react-redux';
import { Close } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import County from 'models/County';
import Language from 'models/Language';
import UserTypeModel from 'models/UserType';
import activeStatus from 'models/ActiveStatus';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import SourceOrganization from 'models/SourceOrganization';

import useStyles from './UsersFilterStyles';
import FilterCreators from './FilterCreators';
import GenericAutoComplete from './GenericAutoComplete';

const activeStatuses: activeStatus[] = [
    {
        displayName: 'לא פעיל',
        value: false
    },
    {
        displayName: 'פעיל',
        value: true
    }
];

const UsersFilter: React.FC<Props> = (props: Props) => {
    const { sourcesOrganization, languages, counties, userTypes, handleFilterChange, handleCloseFitler } = props;

    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    const classes = useStyles();

    return (
        <div className={classes.content}>
            <FormInput fieldName='מסגרת'>
                <GenericAutoComplete
                    options={sourcesOrganization}
                    inputRootClass={classes.autocompleteInput}
                    handleChange={(sourceOrganizations) => handleFilterChange(FilterCreators.SOURCE_ORGANIZATION(
                        sourceOrganizations.map((sourceOrganization: SourceOrganization) => sourceOrganization.displayName)))
                    }
                />
            </FormInput>
            <FormInput fieldName='שפות'>
                <GenericAutoComplete
                    options={languages}
                    inputRootClass={classes.autocompleteInput}
                    handleChange={(languages) => handleFilterChange(FilterCreators.LANGUAGES(
                        languages.map((language: Language) => language.displayName)))
                    }
                />
            </FormInput>
            {
                userType === UserTypeCodes.SUPER_ADMIN &&
                <FormInput fieldName='נפות'>
                    <GenericAutoComplete
                        options={counties}
                        inputRootClass={classes.autocompleteInput}
                        handleChange={(counties) => handleFilterChange(FilterCreators.COUNTY(
                            counties.map((county: County) => county.id)))
                        }
                    />
                </FormInput>
            }
            <FormInput fieldName='סוג משתמש'>
                <GenericAutoComplete
                    options={userTypes}
                    inputRootClass={classes.autocompleteInput}
                    handleChange={(userTypes) => handleFilterChange(FilterCreators.USER_TYPE(
                        userTypes.map((userType: UserTypeModel) => userType.id)))
                    }
                />
            </FormInput>
            <FormInput fieldName='פעיל/לא פעיל'>
                <GenericAutoComplete
                    options={activeStatuses}
                    inputRootClass={classes.autocompleteInput}
                    handleChange={(userStatuses) => handleFilterChange(FilterCreators.USER_STATUS(
                        userStatuses.map((userStatus: activeStatus) => userStatus.value)))
                    }
                />
            </FormInput>
            <IconButton onClick={handleCloseFitler}>
                <Close />
            </IconButton>
        </div>
    );
};

export default UsersFilter;

interface Props {
    sourcesOrganization: SourceOrganization[];
    counties: County[];
    userTypes: UserTypeModel[];
    languages: Language[];
    handleFilterChange: (filterBy: any) => void;
    handleCloseFitler: () => void;
};
