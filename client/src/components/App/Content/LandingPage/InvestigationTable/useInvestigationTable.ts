import swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { differenceInYears } from 'date-fns';

import User from 'models/User';
import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import InvestigationTableRow from "models/InvestigationTableRow";

import useStyle from './InvestigationTableStyles';
import { useInvestigationTableOutcome } from "./InvestigationTableInterfaces";

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
              city: string
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

const useInvestigationTable = (): useInvestigationTableOutcome => {

  const [rows, setRows] = useState<InvestigationTableRow[]>([]);
  const user = useSelector<StoreStateType, User>(state => state.user);

  const classes = useStyle();

  console.log(user)

  useEffect(() => {
    axios.post<InvestigationsReturnType>('/landingPage/investigations', { id: "רוני_1" })
      .then(response => {
        const { data } = response;
        if (data && data.data && data.data.userById) {
          const investigationRows: InvestigationTableRow[] = data.data.userById.investigationsByCreator.nodes.map(investigation => {
            const patient = investigation.investigatedPatientByInvestigatedPatientId;
            console.log("EN: ", investigation)
            return createRowData(investigation.epidemiologyNumber,
              investigation.investigationStatusByInvestigationStatus.displayName,
              patient.personByPersonId.firstName + ' ' + patient.personByPersonId.lastName,
              patient.personByPersonId.phoneNumber,
              Math.floor(differenceInYears(new Date(), new Date(patient.personByPersonId.birthDate))),
              patient.addressByAddress.city)
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

  return {
    tableRows: rows,
  };
};

export default useInvestigationTable;
