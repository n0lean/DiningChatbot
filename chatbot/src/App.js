import React, { Component } from 'react';
import './App.css';
import { ChatFeed, Message, ChatBubble, BubbleGroup } from 'react-chat-ui'
import axios from 'axios'
import { EROFS } from 'constants';

var apigClientFactory = require('aws-api-gateway-client').default;

var config = { invokeUrl: 'https://bvm2azi8h1.execute-api.us-east-1.amazonaws.com' };
var apigClient = apigClientFactory.newClient(config);

var method = 'POST';
var params = {};
var additionParms = {
};
var path = '/dev/chatbot';


const users = {
  0: 'Bot',
  1: 'User',
};

const EXTERNAL_URL = "https://bvm2azi8h1.execute-api.us-east-1.amazonaws.com/dev/chatbot";

const styles = {
  button: {
    backgroundColor: '#fff',
    borderColor: '#1D2129',
    borderStyle: 'solid',
    borderRadius: 20,
    borderWidth: 2,
    color: '#1D2129',
    fontSize: 18,
    fontWeight: '300',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
};


class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  onMessageSubmit(e) {
    const input = this.message;
    console.log(input);
    e.preventDefault();
    if (!input.value) {
      return false;
    }

    this.pushMessage(0, input.value)

    const time = new Date().getTime()

    // find out what body it should sent

    const out = {
      "messages": [
        {
          "type": "type_a",
          "unstructured": {
            "id": "123",
            "text": input.value,
            "timestamp": time
          }
        }
      ]
    }
    input.value = '';

    apigClient.invokeApi(params, path, method, additionParms, out)
      .then((res) => {
        console.log(res);
        this.pushMessage(1, res.data.unstructured.text);
      }).catch((res) => {
        console.log(res);
      })

    // axios.post(EXTERNAL_URL, out, { headers: headers }).then(res => {
    //   console.log(res)
    //   this.pushMessage(1, res['unstructed']['text']);
    // }).catch(error => {
    //   console.log(error)
    // })
    return true;
  }

  pushMessage(recipient, message) {
    const prevState = this.state;
    const newMessage = new Message({
      id: recipient,
      message,
      senderName: users[recipient]
    })
    prevState.messages.push(newMessage);
    this.setState(this.state);
  }


  render() {
    return (
      <div className="container">
        <h1 className="text-Center">Chatbot</h1>
        <div>
          <ChatFeed
            maxHeight={250}
            messages={this.state.messages} // Boolean: list of message objects
            showSenderName
          />

          <form onSubmit={e => this.onMessageSubmit(e)}>
            <input
              ref={m => {
                this.message = m;
              }}
              placeholder="Type a message..."
              className="message-input"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
