import { TimeRange } from 'models/TimeRange';

export default interface AdminLandingPageFilters {
    desks? :  number[],
    timeRange? : TimeRange
};