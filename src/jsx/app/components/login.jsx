var React = require('react');

var Login = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },
  componentDidMount: function() {
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
  },
  formSubmit: function() {
    console.log('formSubmit()');
    var username = React.findDOMNode(this.refs.username).value;
    var password = React.findDOMNode(this.refs.password).value;
    var token = React.findDOMNode(this.refs.token).value;


    console.log('values are: ' + username + ', ' + password + ', ' + token);
    //RecipeActions.handleLogin(username, password, token);
    React.findDOMNode(this.refs.username).value = "";
    React.findDOMNode(this.refs.password).value = "";

  //  consold.log('creds are: ', loginCreds)
  },
  render: function () {
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
});

module.exports = Login;
