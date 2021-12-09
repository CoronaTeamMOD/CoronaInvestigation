import StaticUser from './StaticUser';

interface InvestigationMetaData {
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
    userByLastUpdatorUser: StaticUser;
};

export default InvestigationMetaData;
