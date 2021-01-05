import React from 'react';
import { useSelector } from 'react-redux'
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { TextField, IconButton } from '@material-ui/core';

import County from 'models/County';
import Language from 'models/Language';
import UserTypeModel from 'models/UserType';
import UserTypeEnum from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import SourceOrganization from 'models/SourceOrganization';

import useStyles from './UsersFilterStyles';
import FilterCreators from './FilterCreators'

interface activeStatus {
    displayName: string;
    value: boolean;
}

interface GenericAutoCompleteProps {
    options: SourceOrganization[] | Language[] | County[] | UserTypeModel[] | activeStatus[];
    handleChange: (selectedValues: any) => void;
    className: string;
    inputRootClass?: string;
}

const activeStatuses: activeStatus[] = [
    {
        displayName: 'פעיל',
        value: true
    },
    {
        displayName: 'לא פעיל',
        value: false
    }
];

const GenericAutoComplete: React.FC<GenericAutoCompleteProps> = (props: GenericAutoCompleteProps) => {
    const { options, handleChange, className, inputRootClass } = props

    return (
        <Autocomplete
            disableCloseOnSelect
            multiple
            options={options}
            getOptionLabel={(option: any) => option ? option.displayName : option}
            onChange={(event, selectedValues) => handleChange(selectedValues)}
            className={className}
            classes={{inputRoot: inputRootClass}}
            renderInput={(params) =>
                <TextField
                    {...params}
                />
            }
            renderTags={(tags: any) => {
                const additionalTagsAmount = tags.length - 1;
                const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                return tags[0].displayName + additionalDisplay;
            }}
        />
    )
}

const UsersFilter:React.FC<Props> = ( props : Props ) => {
    const { sourcesOrganization, languages, counties, userTypes, handleFilterChange, handleCloseFitler } = props;

    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    const classes = useStyles();
    
    return (
        <div className={classes.content}>
            <FormInput fieldName='מסגרת'>
                <GenericAutoComplete 
                    options={sourcesOrganization}
                    handleChange={(sourceOrganizations) => handleFilterChange(FilterCreators.SOURCE_ORGANIZATION(
                        sourceOrganizations.map((sourceOrganization: SourceOrganization) => sourceOrganization.displayName)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <FormInput fieldName='שפות'>
                <GenericAutoComplete 
                    options={languages}
                    inputRootClass={classes.autocompleteInput}
                    handleChange={(languages) => handleFilterChange(FilterCreators.LANGUAGES(
                        languages.map((language : Language) => language.displayName)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            {
                userType === UserTypeEnum.SUPER_ADMIN && 
                <FormInput fieldName='נפות'>
                    <GenericAutoComplete 
                        options={counties}
                        handleChange={(counties) => handleFilterChange(FilterCreators.COUNTY(
                            counties.map((county: County) => county.id)))
                        }
                        className={classes.autoComplete}
                    />
                </FormInput>
            }
            <FormInput fieldName='סוג משתמש'>
                <GenericAutoComplete 
                    options={userTypes}
                    handleChange={(userTypes) => handleFilterChange(FilterCreators.USER_TYPE(
                        userTypes.map((userType: UserTypeModel) => userType.id)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <FormInput fieldName='פעיל/לא פעיל'>
                <GenericAutoComplete 
                    options={activeStatuses}
                    handleChange={(userStatuses) => handleFilterChange(FilterCreators.USER_STATUS(
                        userStatuses.map((userStatus: activeStatus) => userStatus.value)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <IconButton onClick={handleCloseFitler}>
                <Close/>
            </IconButton>
        </div>
    );
};

interface Props {
    sourcesOrganization: SourceOrganization[];
    counties: County[];
    userTypes: UserTypeModel[];
    languages: Language[];
    handleFilterChange: (filterBy: any) => void;
    handleCloseFitler: () => void;
}

export default UsersFilter;
