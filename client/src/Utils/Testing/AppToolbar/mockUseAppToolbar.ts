import useAppToolbar from '../../../components/App/AppToolbar/useAppToolbar';


const mockUseAppToolbar =  jest.mock('useAppToolbar', () => ({
    useAppToolbar: () => (false)
}));

export default mockUseAppToolbar;