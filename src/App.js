import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function randomIme() {
  const ime = [
    "Marko ", "Ivan ", "Jura ", "Dino ", "Dorijan ", "Ana "
  ];
  const prezime = [
    "Marković", "Ivanović", "Jupiter", "Petrić"
  ];
  const imena = ime[Math.floor(Math.random() * ime.length)];
  const prezimena = prezime[Math.floor(Math.random() * prezime.length)];
  return imena + prezimena;
}

function randomBoja() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomIme(),
      color: randomBoja(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("cQtZ5i4PwZRVb318", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React chat aplikacija</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
