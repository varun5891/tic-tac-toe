
import React, { Component } from 'react';
import logo from '../../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import GamePlay from '../GamePlay/GamePlay';
import GetUserDetail from '../GetUserDetails/GetUserDetail';
import ShowUsers from '../ShowUsers/ShowUsers';
import { Container } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import Grid from '@material-ui/core/Grid';

class Game extends Component {
  constructor(props) {

    super(props);

    this.state = {
      endpoint: "http://localhost:5000",
      socket: null,
      isGameStarted: false,
      gameId: null,
      gameData: null,
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    // Made a connection with server
    const socket = socketIOClient(endpoint);
    socket.on("connected", data => {
      this.setState({ socket: socket })
    });

    socket.emit('checkUserDetail', { "userName": this.props.userDetails.username });
    // If registration successfully redirect to player list
    this.setState({ isRegistered: true });
  }
  // registrationConfirmation = (data) => {

  // };
  gameStartConfirmation = (data) => {
    // If select opponent player then start game and redirect to game play
    this.setState({ isGameStarted: data.status, gameId: data.game_id, gameData: data.game_data });
  };
  opponentLeft = (data) => {
    // If opponent left then get back from game play to player screen
    alert("Opponent Left");
    this.setState({ isGameStarted: false, gameId: null, gameData: null });
  };
  render() {

    return (
      <Grid container spacing={3}>

        <Grid item xs={12}>
          {
            // !this.state.isGameStarted ? !this.state.isRegistered ? <header className="App-header">
            //   {/* <img src={logo} className="App-logo" alt="logo" /> */}
            //   {/* {this.state.socket
            //     ? <GetUserDetail socket={this.state.socket} registrationConfirmation={this.registrationConfirmation} />
            //     : <p>Loading...</p>} */}
            // </header> : 
            this.state.socket ?
              <ShowUsers socket={this.state.socket} gameStartConfirmation={this.gameStartConfirmation} />
              : <p> Loading....</p>
          }
          {
            this.state.isGameStarted ?
              <GamePlay socket={this.state.socket} gameId={this.state.gameId} gameData={this.state.gameData} opponentLeft={this.opponentLeft} />
              : null
          }
        </Grid>
      </Grid>
    );
  }
}

export default Game;