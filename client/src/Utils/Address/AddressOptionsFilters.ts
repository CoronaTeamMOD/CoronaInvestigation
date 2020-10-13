
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

import City from 'models/City';

export const cityFilterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option:{ id: string , value: City }) => option.value.displayName,
});

export const streetFilterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option:{ id: string, displayName: string }) => option.displayName,
});

