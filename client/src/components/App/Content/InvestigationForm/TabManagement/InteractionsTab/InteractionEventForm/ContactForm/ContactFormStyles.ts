import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    fieldNameNoWrap: {
        whiteSpace: 'nowrap',
    },
    placeTypeSelect: {
        margin: '0 2vmin',
    },
    addContactFields: {
        display: 'flex',
        flexDirection: 'row',
        height: '25vh',
        paddingRight: '0.5vw',
        flexWrap: 'wrap',
        marginBottom: '1vh',
        alignItems: 'center',
    },
    newContactField: {
        width: '15vw',
        marginRight: '2vw',
    },
});

export default useStyles;