import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" style={{color:"white"}}>
            {'Copyright © '}
            <Link style={{color:'white'}} href="https://material-ui.com/">
                Tic Tae Toe
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        marginTop: theme.spacing(8),
    },
    footer: {
        position: `absolute`,
        width: `100%`,
        bottom: 0,
        display: `block`,
        backgroundColor: '#3f51b5',
        color:'white',
        textAlign:'center'
    },
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <footer className={classes.footer}>
                <Container maxWidth="sm">
                    {/* <Typography variant="body1">My sticky footer can be found here.</Typography> */}
                    <Copyright />
                </Container>
            </footer>
        </div>
    );
}