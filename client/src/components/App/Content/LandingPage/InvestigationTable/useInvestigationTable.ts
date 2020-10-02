import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { differenceInYears } from 'date-fns';
import { useHistory } from 'react-router-dom';

import User from 'models/User';
import axios from 'Utils/axios';
import theme from 'styles/theme';
import Investigator from 'models/Investigator';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { initialUserState } from 'redux/User/userReducer';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setCantReachInvestigated } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { TableHeadersNames, IndexedInvestigation } from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';

export const createRowData = (
  epidemiologyNumber: number,
  status: string,
  fullName: string,
  phoneNumber: string,
  age: number,
  city: string,
  investigator: Investigator
): InvestigationTableRow => ({
  epidemiologyNumber,
  status,
  fullName,
  phoneNumber,
  age,
  city,
  investigator
});

type InvestigationsReturnType = {
  data: {
    userById: {
      investigationsByLastUpdator: {
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

export const UNDEFINED_ROW = -1;

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {

  const history = useHistory();
  const classes = useStyle();

  const { selectedInvestigator, setSelectedRow } = parameters;

  const [rows, setRows] = useState<InvestigationTableRow[]>([]);
  const user = useSelector<StoreStateType, User>(state => state.user);

  const getInvestigationsAxiosRequest = (): any => {
    if (user.isAdmin)
      return axios.get<InvestigationsReturnType>(`/landingPage/groupInvestigations?investigationGroup=${user.investigationGroup}`)
    return axios.post<InvestigationsReturnType>('/landingPage/investigations', {});
  }

  useEffect(() => {
    user.userName !== initialUserState.userName && getInvestigationsAxiosRequest()
      .then((response: any) => {
        const { data } = response;
        let allInvestigationsRawData: any = [];

        if (data && data.data && data.data.allUsers) {
          data.data.allUsers.nodes.forEach((element: any) => {
            allInvestigationsRawData.push(...element.investigationsByLastUpdator.nodes)
          });
        }

        if (data && data.data && data.data.userById) {
          allInvestigationsRawData = data.data.userById.investigationsByLastUpdator.nodes;
        }
        
        const investigationRows: InvestigationTableRow[] = allInvestigationsRawData.map((investigation: any) => {
          const patient = investigation.investigatedPatientByInvestigatedPatientId;
          const patientCity = patient.addressByAddress.cityByCity;
          const user = investigation.userByCreator;
          return createRowData(investigation.epidemiologyNumber,
            investigation.investigationStatusByInvestigationStatus.displayName,
            patient.personByPersonId.firstName + ' ' + patient.personByPersonId.lastName,
            patient.personByPersonId.phoneNumber,
            Math.floor(differenceInYears(new Date(), new Date(patient.personByPersonId.birthDate))),
            patientCity ? patientCity.displayName : '',
            user
          )
        })
        .sort((firstInvestigation: InvestigationTableRow, secondInvestigation: InvestigationTableRow) => 
          secondInvestigation.epidemiologyNumber - firstInvestigation.epidemiologyNumber);
          
        setRows(investigationRows)
      })
      .catch((err: any) => {
        Swal.fire({
          title: 'אופס... לא הצלחנו לשלוף',
          icon: 'error',
          customClass: {
            title: classes.errorAlertTitle
          }
        })
        console.log(err)
      });
  }, [user.id, classes.errorAlertTitle, user]);

  const moveToTheInvestigationForm = (epidemiologyNumberVal: number) => {
    setEpidemiologyNum(epidemiologyNumberVal);
    history.push('/investigation');
  }

  const onInvestigationRowClick = (epidemiologyNumberVal: number, currentInvestigationStatus: string) => {
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = user.token;
        config.headers.EpidemiologyNumber = epidemiologyNumberVal;
        setIsLoading(true);
        return config;
      },
      (error) => Promise.reject(error)
    );
    if (currentInvestigationStatus === InvestigationStatus.NEW) {
      axios.post('/investigationInfo/updateInvestigationStartTime', {
        investigationStartTime: new Date(),
        epidemiologyNumber: epidemiologyNumberVal
      }).then(() => {
        axios.post('/investigationInfo/updateInvestigationStatus', {
          investigationStatus: InvestigationStatus.IN_PROCESS,
          epidemiologyNumber: epidemiologyNumberVal
        }).then(() => {
          moveToTheInvestigationForm(epidemiologyNumberVal);
        }).catch(() => failToUpdateInvestigationData());
      }).catch(() => failToUpdateInvestigationData())
    } else {
      setCantReachInvestigated(currentInvestigationStatus === InvestigationStatus.CANT_REACH);
      moveToTheInvestigationForm(epidemiologyNumberVal);
    }
  }

  const failToUpdateInvestigationData = () => {
    Swal.fire({
      title: 'לא הצלחנו לפתוח את החקירה',
      icon: 'error',
      customClass: {
        title: classes.errorAlertTitle
      }
    })
  }

  const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigation => {
    return {
      [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
      [TableHeadersNames.fullName]: row.fullName,
      [TableHeadersNames.phoneNumber]: row.phoneNumber,
      [TableHeadersNames.age]: row.age,
      [TableHeadersNames.city]: row.city,
      [TableHeadersNames.investigatorName]: row.investigator.userName,
      [TableHeadersNames.status]: row.status,
    }
  }

  const getMapKeyByValue = (map: Map<string, User>, value: string): string => {
    const key = Array.from(map.keys()).find(key => map.get(key)?.userName === value);
    return key ? key : ''
  }

  const onInvestigatorChange = (indexedRow: IndexedInvestigation, newSelectedInvestigator: any, currentSelectedInvestigator: string) => {
    if (selectedInvestigator && newSelectedInvestigator.value !== '')
      Swal.fire({
        icon: 'warning',
        title: `<p> האם אתה בטוח שאתה רוצה להחליף את החוקר <b>${currentSelectedInvestigator}</b> בחוקר <b>${newSelectedInvestigator.value.userName}</b>?</p>`,
        showCancelButton: true,
        cancelButtonText: 'לא',
        cancelButtonColor: theme.palette.error.main,
        confirmButtonColor: theme.palette.primary.main,
        confirmButtonText: 'כן, המשך',
        customClass: {
          title: classes.swalTitle,
        }
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/users/changeInvestigator', {
              epidemiologyNumber: indexedRow.epidemiologyNumber,
              user: newSelectedInvestigator.id
            }
          ).then(() => timeout(1900).then(() => {
              setSelectedRow(UNDEFINED_ROW)
              setRows(rows.map((investigation: InvestigationTableRow) => (
                investigation.epidemiologyNumber === indexedRow.epidemiologyNumber ?
                  {
                    ...investigation,
                    investigator: {
                      id: newSelectedInvestigator.id,
                      userName: newSelectedInvestigator.value.userName
                    }
                  }
                  : investigation
              )))
            }))
        } else if (result.isDismissed) {
          setSelectedRow(UNDEFINED_ROW)
        }
      })
  }

  return {
    tableRows: rows,
    onInvestigationRowClick,
    convertToIndexedRow,
    getMapKeyByValue,
    onInvestigatorChange
  };
};

export default useInvestigationTable;
