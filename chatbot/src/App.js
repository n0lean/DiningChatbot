import React, { Component } from 'react';
import './App.css';
import { ChatFeed, Message, ChatBubble, BubbleGroup } from 'react-chat-ui'
import { withRouter } from 'react-router-dom'

import queryString from 'query-string'

const uuidv1 = require('uuid/v1');
var apigClientFactory = require('aws-api-gateway-client').default;

var config = { invokeUrl: 'https://bvm2azi8h1.execute-api.us-east-1.amazonaws.com' };
var apigClient = apigClientFactory.newClient(config);

var id = uuidv1();
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
  constructor(props) {
    super(props);
    this.state = {
      id_token: null,
      access_token: null,
      messages: []
    };
  }

  componentDidMount() {
      var parsed = queryString.parse(this.props.location.hash);
      const prevState = this.state;
      prevState.id_token = parsed.id_token;
      prevState.access_token = parsed.access_token;

      additionParms['headers'] = {'Authorization' : parsed.id_token}
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
            "id": id,
            "text": input.value,
            "timestamp": time
          }
        }
      ]
    }
    console.log(this.state.id_token);
    console.log(this.state.access_token);

    

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

export default withRouter(App);
