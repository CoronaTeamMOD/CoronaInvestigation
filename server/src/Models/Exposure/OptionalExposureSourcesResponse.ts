import CovidPatientDBOutput from './CovidPatientDBOutput';

export default interface OptionalExposureSourcesResponse {
    data: {
        allCovidPatients: {
            nodes: CovidPatientDBOutput[]
        }
    }
}