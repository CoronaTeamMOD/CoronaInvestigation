import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import SourceOrganization from 'models/SourceOrganization';
import County from 'models/County';
import UserType from 'models/UserType';
import Language from 'models/Language';
import FormInput from 'commons/FormInput/FormInput';

import useStyles from './UsersFilterStyles';

const activeStatuses: string[] = ['הכל', 'פעיל', 'לא פעיל'];
const ALL = 'הכל';

const UsersFilter:React.FC<Props> = ( { sourcesOrganization, languages, counties, userTypes }: Props ) => {

    const classes = useStyles();

    useEffect(() => {
        sourcesOrganization.unshift({ displayName: ALL });
        languages.unshift({ displayName: ALL })
        counties.unshift({ id: -1, displayName: ALL });
        userTypes.unshift({ id: -1, displayName: ALL });
    }, [counties, languages, sourcesOrganization, userTypes])

    return (
        <div className={classes.content}>
            <FormInput fieldName='מסגרת'>
                <Autocomplete
                    multiple
                    options={sourcesOrganization}
                    getOptionLabel={(option) => option ? option.displayName : option}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                        />
                    }
                    renderTags={(tags) => {
                        const additionalTagsAmount = tags.length - 1;
                        const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                        return tags[0].displayName + additionalDisplay;
                    }}
                />
            </FormInput>
            <FormInput fieldName='שפות'>
                <Autocomplete
                    multiple
                    options={languages}
                    getOptionLabel={(option) => option ? option.displayName : option}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                        />
                    }
                    renderTags={(tags) => {
                        const additionalTagsAmount = tags.length - 1;
                        const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                        return tags[0] + additionalDisplay;
                    }}
                />
            </FormInput>
            <FormInput fieldName='נפות'>
                <Autocomplete
                    multiple
                    options={counties}
                    getOptionLabel={(option) => option ? option.displayName : option}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                        />
                    }
                    renderTags={(tags) => {
                        const additionalTagsAmount = tags.length - 1;
                        const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                        return tags[0].displayName + additionalDisplay;
                    }}
                />
            </FormInput>
            <FormInput fieldName='סוג משתמש'>
                <Autocomplete
                    multiple
                    options={userTypes}
                    getOptionLabel={(option) => option ? option.displayName : option}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                        />
                    }
                    renderTags={(tags) => {
                        const additionalTagsAmount = tags.length - 1;
                        const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                        return tags[0].displayName + additionalDisplay;
                    }}
                />
            </FormInput>
            <FormInput fieldName='פעיל/לא פעיל'>
                <Autocomplete
                    multiple
                    options={activeStatuses}
                    getOptionLabel={(option) => option ? option : option}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                        />
                    }
                    renderTags={(tags) => {
                        const additionalTagsAmount = tags.length - 1;
                        const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                        return tags[0] + additionalDisplay;
                    }}
                />
            </FormInput>
        </div>
    );
};

interface Props {
    sourcesOrganization: SourceOrganization[];
    counties: County[];
    userTypes: UserType[];
    languages: Language[];
}

export default UsersFilter;
