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
}

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('messages', MessageActions);
    this.createStore('messages', MessageStore, this);
  }
}

class App extends React.Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col sm={12}>
              <PanelContainer>
                <Panel>
                  <PanelBody className='text-center'>
                    <p>BLANK PAGE</p>
                    {this.props.messages.map((m, i) => {
                      return <div key={i}>{m.content}</div>;
                    })}
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
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
        <Sidebar />
        <Header />
        <Body data={data} />
        <Footer />
      </Container>
    );
  }
}
