import { TimeRangeDates } from "models/TimeRange";

export default interface AdminLandingPageFilters {
    desks? :  number[],
    timeRange? : TimeRangeDates
};