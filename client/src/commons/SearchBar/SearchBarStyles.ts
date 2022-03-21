import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    searchBar: {
        height: 'fit-content',
        margin: '1vh',
        width: '22vw',
        backgroundColor: 'white',
        borderRadius: '20px'
    },
    searchBarIcons: {
        marginRight: '-10px'
    }
}));

export default useStyles;
