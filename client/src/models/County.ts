import District from './District';

interface County {
    id: number;
    displayName: string;
    district: District;
}

export default County;