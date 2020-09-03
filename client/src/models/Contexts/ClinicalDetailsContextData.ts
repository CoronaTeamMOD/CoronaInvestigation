interface ClinicalDetailsData {
    isolationStartDate: Date;
    isolationEndDate: Date;
    isolationAddress: string;
    hasTroubleIsolating: boolean;
    troubleIsolatingReason: string;
    symptomsStartDate: Date;
    symptoms: string[];
    backgroundIllnesses: string[];
    hospital: string;
    hospitalStartDate: Date;
    hospitalEndDate: Date;
};

export default ClinicalDetailsData;
