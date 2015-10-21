import classNames from 'classnames';
import SidebarMixin from 'global/jsx/sidebar_component';

import Header from 'common/header';
import Sidebar from 'common/sidebar';
import Footer from 'common/footer';

import { Actions, Store, Flummox } from 'flummox';
import FluxComponent from 'flummox/component';

class MessageActions extends Actions {
  newMessage(content) {
    return content;
  }
}

class MessageStore extends Store {
  constructor(flux) {
    super();

    const messageActions = flux.getActions('messages');
    this.register(messageActions.newMessage, this.handleNewMessage);
    this.messageCounter = 0;

    this.state = {};
  }

  handleNewMessage(content) {
    const id = this.messageCounter++;

    var messages = this.state.messages || [];
    messages.push({
      content,
      id,
    });

    this.setState({
      messages: messages
    });
  }

  handleLogin() {
    console.log('handleLogin()');
  }
}

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('messages', MessageActions);
    this.createStore('messages', MessageStore, this);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
  }
  componentDidMount() {
    //console.log(this.props);

    var obj = {
      meta: {
        "apiKey":"21922323610bcce1f91d8c272d71a4a7299aabef"
      }
    };
    obj = JSON.stringify(obj);

    var that = this;
    $.ajax({
      method: "POST",
      url: "http://dev.api.stationlocal.com/session/new",
      data: obj,
      success: function(data){
        var token = data.Payload.Token;
        console.log('token is: ' + token);
        that.setState({ loginReqs: token });
      },
      error: function(data) {
        console.log('There was an error with the request.');
      }
    });
  }
  formSubmit() {
    console.log('formSubmit()');
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    var token = this.refs.loginToken.getDOMNode().value;

    RecipeActions.handleLogin(username, password, token);
    this.refs.username.getDOMNode().value = "";
    this.refs.password.getDOMNode().value = "";

  //  consold.log('creds are: ', loginCreds)
  }
  render() {
    var loginToken = this.state.loginReqs
    return (
      <Container id='body' className='login'>
        <Grid>
          <Row>
            <div className='container'>
              <Col sm={6} smOffset={3} className="text-center">
                <img id='station-logo' src='/imgs/logos/station/station-logo.svg' className="img-responsive" />
                <h2 className='page-title'>Client Dashboard</h2>


                <form id="login">
                  <input type="text" name="username" ref='username' placeholder='Login' />
                  <input type="text" name="password" ref='password' placeholder='Password' />
                  <input type='hidden' name='token' ref='token'value={loginToken} />
                  <a href='#' className='forgot-link'>forgot password</a>
                  <div className="btn btn-default st-btn" onClick={this.formSubmit}>Sign In</div>
                </form>

              </Col>
            </div>
          </Row>
        </Grid>
      </Container>
    );
  }
}

class Body extends React.Component {
  render() {
    const flux = new Flux();

    // client side flux data
    flux.getActions('messages').newMessage('Hello, world!');

    // server side flux data
    if(this.props.data) {
      flux.getActions('messages').newMessage(this.props.data);
    }

    return (
      <FluxComponent flux={flux} connectToStores={['messages']}>
        <App />
      </FluxComponent>
    );
  }
}

@SidebarMixin
export default class extends React.Component {
  render() {
    var classes = classNames({
      'container-open': this.props.open
    });

    var data = this.props.params.server_data
               || global.server_data
               || "{server_data}"; // setting a default so React doesn't choke
                                   // on difference in renders

    return (
      <Container id='container' className={classes}>
        <Body data={data}  />
      </Container>
    );
  }
}
