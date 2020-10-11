import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { differenceInYears, format } from 'date-fns';

import User from 'models/User';
import theme from 'styles/theme';
import Investigator from 'models/Investigator';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import axios, { activateIsLoading } from 'Utils/axios';
import { initialUserState } from 'redux/User/userReducer';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import { setEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setCantReachInvestigated } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { TableHeadersNames, IndexedInvestigation } from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';

export const createRowData = (
  epidemiologyNumber: number,
  coronaTestDate: string,
  priority: number,
  status: string,
  fullName: string,
  phoneNumber: string,
  age: number,
  city: string,
  investigator: Investigator
): InvestigationTableRow => ({
  epidemiologyNumber,
  coronaTestDate,
  priority,
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
const defaultOrderBy = 'defaultOrder';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {

  const history = useHistory();
  const classes = useStyle();

  const { selectedInvestigator, setSelectedRow } = parameters;

  const [rows, setRows] = useState<InvestigationTableRow[]>([]);
  const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
  const [orderBy, setOrderBy] = useState<string>('defaultOrder');

  const user = useSelector<StoreStateType, User>(state => state.user);
  const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);


  const getInvestigationsAxiosRequest = (orderBy: string): any => {
    if (user.isAdmin)
      return axios.get<InvestigationsReturnType>(`landingPage/groupInvestigations?orderBy=${orderBy}`)
    return axios.get<InvestigationsReturnType>(`/landingPage/investigations?orderBy=${orderBy}`);
  }

  useEffect(() => {
    setIsLoading(true);
    user.userName !== initialUserState.userName && getInvestigationsAxiosRequest(orderBy)
      .then((response: any) => {

        const { data } = response;
        let allInvestigationsRawData: any = [];

        if (user.investigationGroup !== -1) {

          if (data && data.allInvestigations) {
            allInvestigationsRawData = data.allInvestigations
          }

          const investigationRows: InvestigationTableRow[] = allInvestigationsRawData.map((investigation: any) => {
            const patient = investigation.investigatedPatientByInvestigatedPatientId;
            const covidPatient = patient.covidPatientByCovidPatient;
            const patientCity = (covidPatient && covidPatient.addressByAddress) ? covidPatient.addressByAddress.cityByCity : '';
            const user = investigation.userByLastUpdator;
            return createRowData(investigation.epidemiologyNumber,
              investigation.coronaTestDate,
              investigation.priority,
              investigation.investigationStatusByInvestigationStatus.displayName,
              covidPatient.fullName,
              covidPatient.primaryPhone,
              covidPatient.age,
              patientCity ? patientCity.displayName : '',
              user
            )
          });
          setRows(investigationRows);
          setIsLoading(false);
        }
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
  }, [user.id, classes.errorAlertTitle, user, orderBy]);

  const moveToTheInvestigationForm = (epidemiologyNumberVal: number) => {
    setEpidemiologyNum(epidemiologyNumberVal);
    history.push('/investigation');
  }

  const onInvestigationRowClick = (epidemiologyNumberVal: number, currentInvestigationStatus: string) => {
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = user.token;
        config.headers.EpidemiologyNumber = epidemiologyNumberVal;
        activateIsLoading(config);
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

  const getFormattedDate = (date: string) => {
    return format(new Date(date), 'dd/MM')
  }

  const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigation => {
    return {
      [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
      [TableHeadersNames.coronaTestDate]: getFormattedDate(row.coronaTestDate),
      [TableHeadersNames.priority]: row.priority,
      [TableHeadersNames.fullName]: row.fullName,
      [TableHeadersNames.phoneNumber]: row.phoneNumber,
      [TableHeadersNames.age]: row.age,
      [TableHeadersNames.city]: row.city,
      [TableHeadersNames.investigatorName]: row.investigator.userName,
      [TableHeadersNames.investigationStatus]: row.status,
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

  const getTableCellStyles = (rowIndex: number, cellKey: string) => {
    let classNames = [];

    if (cellKey === TableHeadersNames.investigatorName) {
      classNames.push(classes.columnBorder);
    }

    if (isDefaultOrder && !isLoading) {
      if (rows.length - 1 !== rowIndex && (getFormattedDate(rows[rowIndex].coronaTestDate) !==
        getFormattedDate(rows[rowIndex + 1].coronaTestDate))) {
        classNames.push(classes.rowBorder)
      }
    }

    return classNames;
  }

  const sortInvestigationTable = (orderByValue: string) => {
    setIsDefaultOrder(orderByValue === 'defaultOrder')
    setOrderBy(orderByValue);
  }

  return {
    tableRows: rows,
    onInvestigationRowClick,
    convertToIndexedRow,
    getMapKeyByValue,
    onInvestigatorChange,
    getTableCellStyles,
    sortInvestigationTable
  };
};

export default useInvestigationTable;
