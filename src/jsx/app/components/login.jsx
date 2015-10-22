var React = require('react');
var McFly = require('mcfly');
var _ = require('lodash');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


/** McFly */

var Flux = new McFly();

/** Store */

var _logins = [];
var _errors = '';

function loginActions(creds){
    _logins.push(creds);
    console.log('_logins are: ', _logins)
    clearError();
}

function errorAction(msg) {
  _errors = msg;
  console.log('_error is: ', msg);
}

function clearRecipes(){
    _logins = [];
}

function clearError() {
  _errors = '';
}

function deleteRecipe(index){
    _logins.splice(index,1);
}

var LoginStore = Flux.createStore({
    getLogins: function(){
       return _logins;
    },
    checkLogin: function() {
      console.log('checking');
      return _errors;
    }
}, function(payload){
    if(payload.actionType === "LOGIN_SUCCESS") {
      console.log('made it in payload');
        var creds = ({
          username: payload.username,
          password: payload.password
        });
        loginActions(creds);
        LoginStore.emitChange();
    }
    if(payload.actionType === "LOGIN_FAIL") {
      console.log('bad creds...');
      var errorMsg = 'Error Bro.';
      errorAction(payload.message);
      LoginStore.emitChange();
    }
    if(payload.actionType === "CLEAR_ERROR") {
        clearError();
        LoginStore.emitChange();
    }
    if(payload.actionType === "CLEAR_RECIPES") {
        clearRecipes();
        LoginStore.emitChange();
    }
    if(payload.actionType === "DELETE_RECIPE") {
        deleteRecipe(payload.index);
        LoginStore.emitChange();
    }
});

/** Actions */

var LoginActions = Flux.createActions({
    loginAction: function(username, password, token){

      var obj = {
        meta: {
          "apiKey":"21922323610bcce1f91d8c272d71a4a7299aabef",
          "sessionToken": token,
          "requestedAt": "{{timestamp}}",
          "request": "LOGIN_NATIVE"
        },
        payload: {
          "username": username,
          "password": password
        }
      };
      obj = JSON.stringify(obj);

      var that = this;
      var data = '';
      $.ajax({
        method: "POST",
        url: "http://dev.api.stationlocal.com/login",
        data: obj,
        success: function(data){
          console.log('data is: ', data);
          if( data.Success === true ) {
            LoginActions.loginSuccess(username, password);
          } else {
            var errorMsg = data.Errors[0].Message;
            LoginActions.loginFail(errorMsg);
          }
        },
        error: function(data) {
          console.log('There was an error with the request.');
        }
      });
    },
    loginSuccess: function(username, password) {
       return {
          actionType: "LOGIN_SUCCESS",
          username: username,
          password: password
       }
    },
    loginFail: function (errorMsg) {
      return {
        actionType: "LOGIN_FAIL",
        message: errorMsg
      }
    },
    clearError: function() {
      return{
        actionType: "CLEAR_ERROR"
      }
    },
    clearRecipes: function(){
       return {
          actionType: "CLEAR_RECIPES"
       }
    },
    deleteRecipe: function(index){
       return {
          actionType: "DELETE_RECIPE",
          index: index
       }
    }
});

function getLogins(){
   return {
       recipes: LoginStore.getLogins(),
       errors: LoginStore.checkLogin()
   }
}


/** Controller View */

var Login = React.createClass({
    mixins: [LoginStore.mixin],
    getInitialState: function(){
        return getLogins();
    },
    storeDidChange: function() {
        console.log('changed');
        var test =  'this is from the did change function!';
        this.setState(getLogins());
    },
    render: function() {
        return <Recipes recipes={this.state.recipes} errors={this.state.errors} />;
        // return <Recipes errors={this.state.errors} />;
    }
});

/** Component */

var Recipes = React.createClass({
  getInitialState: function() {
    return {
      sessToken: ''
    }
  },
  loginAction: function() {
    var username = React.findDOMNode(this.refs.username).value;
    var password = React.findDOMNode(this.refs.password).value;
    var token = React.findDOMNode(this.refs.token).value;

    LoginActions.loginAction(username, password, token);
    // React.findDOMNode(this.refs.username).value = "";
    // React.findDOMNode(this.refs.password).value = "";
  },
  clearError: function(){
    console.log('clear it');
      LoginActions.clearError();
  },
  clearRecipes: function(){
      LoginActions.clearRecipes();
  },
  deleteRecipe: function(index){
      LoginActions.deleteRecipe(index);
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
        that.setState({ sessToken: token });
      },
      error: function(data) {
        console.log('There was an error with the request.');
      }
    });
  },
  render: function () {
    var self = this;
    var loginToken = this.state.sessToken;


    console.log('props are: ', this.props);
    var error = this.props.errors;
    if( error != '' ){
      console.log('not empty!');
      var showErrorMsg = <div className='error' onClick={this.clearError}><i className="material-icons">error</i> {error}</div>
    }else {
      var showErrorMsg = '';
    }

    return (
      <Container id='body' className='login'>
        <Grid>
          <Row>
            <div className='container'>
              <Col sm={6} smOffset={3} className="text-center">
                <img id='station-logo' src='/imgs/logos/station/station-logo.svg' className="img-responsive" />
                <h2 className='page-title'>Client Dashboard</h2>

                <div id="login">
                  <input type="text" name="username" ref='username' placeholder='Login' />
                  <input type="password" name="password" ref='password' placeholder='Password' />
                  <input type='hidden' name='token' ref='token'value={loginToken} />
                  <ul className="recipes">
                      { this.props.recipes.map(function(creds, index){
                        console.log('now.. ', creds);
                          return <li key={index}>User: {creds.username} password: {creds.password} <button type="button" onClick={self.deleteRecipe.bind(self, index)}>Delete</button></li>
                      })}
                  </ul>
                  {showErrorMsg}
                  <div className='btn st-btn' onClick={this.loginAction}>Sign In</div>
                </div>

              </Col>
            </div>
          </Row>
        </Grid>
      </Container>
    );
  }
});

module.exports = Login;
