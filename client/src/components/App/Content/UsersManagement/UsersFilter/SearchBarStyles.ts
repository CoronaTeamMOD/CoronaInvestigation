import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    searchBar: {
        justifyContent: 'flex-end',
        width: '20vw',
        backgroundColor: 'white',
        borderRadius: '20px'
    },
    searchBarIcons: {
        marginRight: '-1vw'
    }
}));

export default useStyles;
