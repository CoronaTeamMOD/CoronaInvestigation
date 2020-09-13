import swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { differenceInYears } from 'date-fns';
import { useHistory } from 'react-router-dom';

import User from 'models/User';
import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import { initialUserState } from 'redux/User/userReducer';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { useInvestigationTableOutcome } from './InvestigationTableInterfaces';

export const createRowData = (
  epidemiologyNumber: number,
  status: string,
  fullName: string,
  phoneNumber: string,
  age: number,
  city: string
): InvestigationTableRow => ({
  epidemiologyNumber,
  status,
  fullName,
  phoneNumber,
  age,
  city,
});

type InvestigationsReturnType = {
  data: {
    userById: {
      investigationsByCreator: {
        nodes: [{
          epidemiologyNumber: number,
          investigatedPatientByInvestigatedPatientId: {
            addressByAddress: {
              cityByCity: {
                 displayName: string
              }
            },
            personByPersonId: {
              birthDate: Date,
              firstName: string,
              lastName: string,
              phoneNumber: string
            },
          }
          investigationStatusByInvestigationStatus: {
            displayName: string
          }
        }]
      }
    }
  }
};

const handlingInvestigationStatus = 'בטיפול';

const useInvestigationTable = (): useInvestigationTableOutcome => {

  const history = useHistory();
  const classes = useStyle();

  const [rows, setRows] = useState<InvestigationTableRow[]>([]);
  const user = useSelector<StoreStateType, User>(state => state.user);

  useEffect(() => {
    user.name !== initialUserState.name && axios.post<InvestigationsReturnType>('/landingPage/investigations', { userName: user.name })
      .then(response => {
        const { data } = response;
        if (data && data.data && data.data.userById) {
          const investigationRows: InvestigationTableRow[] = data.data.userById.investigationsByCreator.nodes.map(investigation => {
            const patient = investigation.investigatedPatientByInvestigatedPatientId;
            return createRowData(investigation.epidemiologyNumber,
              investigation.investigationStatusByInvestigationStatus.displayName,
              patient.personByPersonId.firstName + ' ' + patient.personByPersonId.lastName,
              patient.personByPersonId.phoneNumber,
              Math.floor(differenceInYears(new Date(), new Date(patient.personByPersonId.birthDate))),
              patient.addressByAddress.cityByCity.displayName)
          });
          setRows(investigationRows)
        }
      })
      .catch(err => {
        swal.fire({
          title: 'אופס... לא הצלחנו לשלוף',
          icon: 'error',
          customClass: {
            title: classes.errorAlertTitle
          }
        })
        console.log(err)
      });
  }, [user.id, classes.errorAlertTitle]);

  const onInvestigationRowClick = (epidemiologyNumberVal: number) => {
    axios.interceptors.request.use(
        (config) => {
            config.headers.Authorization = user.token;
            config.headers.EpidemiologyNumber = epidemiologyNumberVal;
            config.headers.UserName = user.name
            setIsLoading(true);
            return config;
        },
        (error) => Promise.reject(error)
    );
    axios.post('/investigationInfo/updateInvestigationStatus', {
      investigationStatus: handlingInvestigationStatus,
      epidemiologyNumber: epidemiologyNumberVal
    }).then(() => {
      setEpidemiologyNum(epidemiologyNumberVal)
      history.push('/investigation')
    });
  }

  return {
    tableRows: rows,
    onInvestigationRowClick
  };
};

export default useInvestigationTable;
