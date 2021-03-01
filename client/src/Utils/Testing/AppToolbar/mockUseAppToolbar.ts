import useAppToolbar from '../../../components/App/AppToolbar/useAppToolbar';


jest.mock('useAppToolbar', () => ({
    useAppToolbar: () => ();
}));