import React from 'react';
import axios from 'axios';

import Desk from 'models/Desk';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

interface Props {
    
}

const useAdminLandingPage = (props: Props) => {
    const fetchStats = () => {
        axios.get('/adminLandingPage/stats').then( res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }
    
    return {
        fetchStats
    }
}

export default useAdminLandingPage;
