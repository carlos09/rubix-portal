var React = require('react');


var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      stations: []
    }
  },
  componentDidMount: function() {
    var obj = {
      meta: {
        "apiKey": "21922323610bcce1f91d8c272d71a4a7299aabef",
        "sessionToken": "c71802cf1e96-76bc1f7f-4646-454d-8686-ba6e63e62b40bbf2cb09e2e786237b14302a53796171d9f8",
        "requestedAt":"{{timestamp}}",
        "request":"STATIONS"
      },
      payload: {
        "stationOffset":0,
        "stationCount":200
      }
    };
    obj = JSON.stringify(obj);

    var that = this;
    $.ajax({
      method: "POST",
      url: "http://dev.api.stationlocal.com/stations",
      data: obj,
      success: function(data){
        var stations = data.Payload.Stations;
        that.setState({ stations: stations});
      },
      error: function(data) {
        console.log('There was an error with the request.');
      }
    });
  },
  handleClick: function () {
    console.log('you clicked on ');
  },
  render: function () {
    var stationsList = this.state.stations;

    console.log(stationsList);

    return (
      <div>
        <div className='container-fluid title-header'>
          <Col xs={12}>
            <h2><i className="material-icons">wifi_tethering</i> Stations</h2>
          </Col>
        </div>

        <Container>
          <Grid>
          {
            stationsList.map( function( station, i ){
              return <Row className='container-fluid station-view' key={i} onClick={this.handleClick.bind(this, i)}>
                  <Col sm={1} className='vert-align-middle'>
                    <img src={station.Image} className='img-responsive'/>
                  </Col>
                  <Col sm={7} className='vert-align-middle'>
                    <h4>{station.Identifier}</h4>
                  </Col>
                  <Col sm={3} className='vert-align-middle'>
                    <p className='listen'>Listening: {station.LastActivityAt}</p>
                  </Col>
                  <Col sm={1} className='vert-align-middle'>
                    <p className='edit-link'>edit</p>
                  </Col>
                </Row>
            })
          }
          </Grid>
        </Container>
      </div>
    );
  }
});

module.exports = Dashboard;
