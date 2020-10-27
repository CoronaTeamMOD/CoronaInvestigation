import React from 'react';
import { useSelector } from 'react-redux'
import { TextField, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

import SourceOrganization from 'models/SourceOrganization';
import County from 'models/County';
import UserTypeModel from 'models/UserType';
import UserTypeEnum from 'models/enums/UserType';
import Language from 'models/Language';
import FormInput from 'commons/FormInput/FormInput';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'
import StoreStateType from 'redux/storeStateType'

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
    const {options, handleChange, className} = props

    return (
        <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option: any) => option ? option.displayName : option}
            onChange={(event, selectedValues) => handleChange(selectedValues)}
            className={className}
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

    const userType = useSelector<StoreStateType, number>(state => state.user.userType);

    const classes = useStyles();
    
    return (
        <div className={classes.content}>
            <FormInput fieldName='מסגרת'>
                <GenericAutoComplete 
                    options={sourcesOrganization}
                    handleChange={(sourceOrganizations) => handleFilterChange(get(FilterCreators, 'SOURCE_ORGANIZATION').create(
                        sourceOrganizations.map((sourceOrganization: SourceOrganization) => sourceOrganization.displayName)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <FormInput fieldName='שפות'>
                <GenericAutoComplete 
                    options={languages}
                    handleChange={(languages) => handleFilterChange(get(FilterCreators, 'LANGUAGES').create(
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
                        handleChange={(counties) => handleFilterChange(get(FilterCreators, 'COUNTY').create(
                            counties.map((county: County) => county.id)))
                        }
                        className={classes.autoComplete}
                    />
                </FormInput>
            }
            <FormInput fieldName='סוג משתמש' labelLength={8}>
                <GenericAutoComplete 
                    options={userTypes}
                    handleChange={(userTypes) => handleFilterChange(get(FilterCreators, 'USER_TYPE').create(
                        userTypes.map((userType: UserTypeModel) => userType.id)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <FormInput fieldName='פעיל/לא פעיל' labelLength={8}>
                <GenericAutoComplete 
                    options={activeStatuses}
                    handleChange={(userStatuses) => handleFilterChange(get(FilterCreators, 'USER_STATUS').create(
                        userStatuses.map((userStatus: activeStatus) => userStatus.value)))
                    }
                    className={classes.autoComplete}
                />
            </FormInput>
            <IconButton>
                <Close onClick={handleCloseFitler}/>
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
