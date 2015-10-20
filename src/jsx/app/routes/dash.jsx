import classNames from 'classnames';
import SidebarMixin from 'global/jsx/sidebar_component';

import Header from 'common/header';
import Sidebar from 'common/sidebar';
import Footer from 'common/footer';

import Dashboard from 'components/dashboard';
import Assets from 'components/assets';

class Dash extends React.Component {
  render() {
    return (
      <div id='body' className='dashboard'>
            <Dashboard />
            <Assets />
      </div>
    );
  }
}

@SidebarMixin
export default class extends React.Component {
  render() {
    var classes = classNames({
      'container-open': this.props.open
    });

    return (
      <Container id='container' className={classes}>
        <Sidebar />
        <Dash />
      </Container>
    );
  }
}
