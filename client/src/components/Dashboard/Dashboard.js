import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DataTableGrid from '../Common/DataTableGrid/DataTableGrid';
import { getUsers } from '../../Services/User/User_Service';
import nextId from "react-id-generator";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
}));

export default function Dashboard() {

  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  const columns = [
    {
      headerName: 'ID',
      width: 100,
      valueGetter:Math.random()
    },
    {
      field: 'firstname',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'soap',
      headerName: 'SOAP',
      width: 150,
      editable: true,
    },
    {
      field: 'registrationdate',
      headerName: 'Registration Date',
      width: 200,
      editable: true,
    },
    {
      field: 'lastlogindate',
      headerName: 'Last Login Date',
      type: Date,
      width: 200,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      editable: true,
    },

  ];

  const rowss = [
    {
      roles: [],
      _id: "60d621932006542e948d6c8f",
      username: "varun",
      email: "kakaniyavarun@gmail.com",
      password: "$2a$08$04.d6Qna30WKaEKrxqTIdOzOusq9RwYiw2kXXFj1BtCvIRbIp3HHW",
      firstname: "Varun",
      lastname: "Patel",
      lastlogindate: "2021-06-25T18:35:14.565Z",
      registrationdate: "2021-06-25T18:33:39.921Z",
      status: "true",
      __v: 0,
      
    }
  ]
  const rows = [
    { id: 1, lastName: 'Patel', firstName: 'Varun', soap: 'Test', registrationDate: '05/05/2015', lastLoginDate: '05/05/20150', status: 'Active' },
    { id: 2, lastName: 'Kakasaniya', firstName: 'Vishal', soap: 'Test', registrationDate: '05/05/2015', lastLoginDate: '05/05/20150', status: 'Active' },

    { id: 3, lastName: 'Kakaniya', firstName: 'Tushar', soap: 'Test', registrationDate: '05/05/2015', lastLoginDate: '05/05/20150', status: 'Active' },

    { id: 4, lastName: 'Kakaniya', firstName: 'Satish', soap: 'Test', registrationDate: '05/05/2015', lastLoginDate: '05/05/20150', status: 'Active' },

  ];


  const onMount = () => {
    getUsers().then(resp => {
      if (resp.data.status === 200) {
        if (resp.data.users.length !== 0) {
          setUsers(resp.data.users);
        } else {
          alert("No User Data Found");
        }
      }
    })
  }

  useEffect(onMount, []);
  return (
    <div className={classes.paper}>
      <Grid container>
        <DataTableGrid rows={users} columns={columns} />
      </Grid>
    </div>
  );
}