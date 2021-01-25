import ContactEvent from './ContactEvent';
import CovidPatient from './CovidPatient';

type ConnectedInvestigation = {
    epidemiologyNumber: number,
    contactEventsByInvestigationId:{
        nodes : ContactEvent[]
    },
    investigatedPatientByInvestigatedPatientId: CovidPatient
}

export default ConnectedInvestigation;