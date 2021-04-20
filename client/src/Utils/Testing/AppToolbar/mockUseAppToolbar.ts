import useAppToolbar from '../../../components/App/AppToolbar/useAppToolbar';


const mockUseAppToolbar =  jest.mock('useAppToolbar', () => ({
    useAppToolbar: () => ();
}));

export default mockUseAppToolbar;