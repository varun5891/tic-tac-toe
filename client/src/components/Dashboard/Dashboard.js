import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DataTableGrid from '../Common/DataTableGrid/DataTableGrid';
import { getUsers } from '../../Services/User/User_Service';
import Swal from 'sweetalert2';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom'


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
  const [playNewGame, setPlayNewGame] = React.useState(false);
  const history = useHistory();

  const columns = [
    {
      field: 'firstname',
      headerName: 'First name',
      flex: 0.2,
      editable: true,
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      flex: 0.2,
      editable: true,
    },
    {
      field: 'soap',
      headerName: 'SOAP',
      flex: 0.15,
      editable: true,
    },
    {
      field: 'registrationdate',
      headerName: 'Registration Date',
      flex: 0.2,
      editable: true,
      valueFormatter: (params) => { return moment(params.row.registrationdate).format('DD/MM/YYYY'); },
    },
    {
      field: 'lastlogindate',
      headerName: 'Last Login Date',
      flex: 0.2,
      editable: true,
      valueFormatter: (params) => { return moment(params.row.registrationdate).format('DD/MM/YYYY'); },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.15,
      editable: true,
      valueFormatter: (params) => { return params.row.status === 'true' ? 'Active' : 'InActive' },
    },

  ];

  const onPlayNewGame = () => {
    history.push(`/game`);
  }

  const onMount = () => {
    getUsers().then(resp => {
      if (resp.data.status === 200) {
        if (resp.data.users.length !== 0) {
          setUsers(resp.data.users);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `No User Data found!`,
          })
        }
      }
    })
  }

  useEffect(onMount, []);
  return (
    <div className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" style={{ float: 'right' }} onClick={onPlayNewGame}>
            Play New Game
          </Button>
        </Grid>
      </Grid>

      {playNewGame ?
        <Grid container style={{ marginTop: '20px' }}>
         
        </Grid>
        : null}

      <Grid container style={{ marginTop: '20px' }}>
        <DataTableGrid rows={users} columns={columns} />
      </Grid>
    </div>
  );
}