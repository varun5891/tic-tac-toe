import React, { Component, Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';
import './ShowUsers.css';
class ShowUsers extends Component {
    constructor() {
        super();
        this.state = {
            opponents: [],
            selected: false
        };
    }
    componentDidMount() {
        this.props.socket.on('getOpponentsResponse', data => {
            // console.log(data);
            this.setState({
                opponents: data
            });
        });
        this.props.socket.on('newOpponentAdded', data => {
            // console.log(data);
            this.setState({
                opponents: [...this.state.opponents, data]
            });
        });
        this.props.socket.on('opponentDisconnected', data => {
            var flag = false;
            var i = 0;
            for (i = 0; i < this.state.opponents.length; i++) {
                if (this.state.opponents[i].id === data.id) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                var array = [...this.state.opponents];
                array.splice(i, 1);
                this.setState({ opponents: array });
            }
        });
        this.props.socket.on('excludePlayers', data => {
            console.log(data);
            for (var j = 0; j < data.length; j++) {
                var flag = false;
                var i = 0;
                for (i = 0; i < this.state.opponents.length; i++) {
                    if (this.state.opponents[i].id === data[j]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    var array = [...this.state.opponents];
                    array.splice(i, 1);
                    this.setState({ opponents: array });
                }
            }

        });
        this.props.socket.on('gameStarted', data => {
            console.log(data);
            this.props.gameStartConfirmation(data);
        });
        
        this.props.socket.emit('getOpponents', {});
    }
    selectOpponent = (index) => {
        this.setState({
            selected: true
        })
        this.props.socket.emit('selectOpponent', { "id": this.state.opponents[index].id });
    };
    render() {
        return (
            <Fragment>
                { this.state.selected ? null : <h2>Please select opponent from the following</h2>}
                
                <ListGroup onSelect={this.selectOpponent}>
                    {this.state.opponents.length === 0 ? this.state.selected ? null : <p> Please Wait till Other Players Join the Game.</p> : this.state.opponents.map(function (opponent, index) {
                        return <ListGroup.Item action={true} className="opponent-item" key={index} eventKey={index} > {opponent.userName.toUpperCase()} | Played : {opponent.played}  | Won : {opponent.won}  | Draw : {opponent.draw}</ListGroup.Item>;
                    })}
                </ListGroup>
            </Fragment>
        );
    }
}

export default ShowUsers;