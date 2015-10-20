import { Route, Router } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import HashHistory from 'react-router/lib/HashHistory';

import Blank from 'routes/blank';
import Blank2 from 'routes/blank2';
//import Blank3 from 'routes/blank3';
import Login from 'routes/login';

export default (withHistory, onUpdate) => {
  const history = withHistory?
                  (Modernizr.history ?
                    new BrowserHistory
                  : new HashHistory)
                : null;
  return (
    <Router history={history} onUpdate={onUpdate}>
      <Route path='/' component={Blank} />
      <Route path='/blank2' component={Blank2} />
      <Route path='/login' component={Login} />
    </Router>
  );
};
