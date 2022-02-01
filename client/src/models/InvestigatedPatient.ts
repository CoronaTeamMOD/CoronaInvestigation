interface InvestigatedPatient {
    investigatedPatientId: number;
    isDeceased: boolean;
    isCurrentlyHospitialized: boolean;
    birthDate: Date;
    fullName: string;
};

export default InvestigatedPatient;