var React = require('react');

import CPicker from './colorpicker';
import LogoDropzone from './dropzone-logo';

var Assets = React.createClass({
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
  render: function () {
    var stationsList = this.state.stations;

    return (
      <div>
        <div className='container-fluid title-header'>
          <Col xs={12}>
            <h2><i className="material-icons">content_copy</i> Assets</h2>
          </Col>
        </div>

        <Container>
          <Grid>
            <Row className='asset-download'>
              <Col sm={6} smOffset={1} className='vert-align-middle'>
                <h3 className='heading'>Station PSD Template</h3>
                <p className='sub-heading'>This should help you find a background image that works for you </p>
              </Col>
              <Col sm={4} smOffset={1} className='vert-align-middle'>
                <input type='button' className='btn st-btn st-orange' value='Download' />
                <p className='small-text text-center'>Made for Photoshop CC 2015</p>
              </Col>
            </Row>

            <Row className='logo-color'>
              <Col sm={8} smOffset={2} className='text-center'>
                <h3 className='heading'>Logo and Color</h3>

                <p className='upload-info'>Please upload a image that is at minimum 1000 x 1000 pixels. We ask that you please submit a png with no background. We will use the color as your accent color throughout the app.</p>
                <p className='upload-sub-info'>Please Note: Everytime this logo or color is updated, we will need to resubmit your app to their respective app stores.</p>

                <LogoDropzone />
                <CPicker />
              </Col>
            </Row>

            <Row className='background-upload'>
              <Col sm={8} smOffset={2} className='text-center'>
                <h3 className='heading'>Background Image</h3>

                <p className='upload-info'>Please upload a image that is at minimum 1300 x 2300 pixels. This will be used as the main image for your app, across all platforms.</p>
                <p className='upload-sub-info'>Please Note: Everytime this image is updated, we will need to resubmit your app to their respective app stores.</p>
              </Col>
            </Row>

            <Row className='app-icon-upload'>
              <Col sm={8} smOffset={2} className='text-center'>
                <h3 className='heading'>App Icon</h3>

                <p className='upload-info'>Please upload a image that is at minimum 1024 x 1024 pixels. This will be used as the App Icon for your app, across all platforms.</p>
                <p className='upload-sub-info'>Please Note: Everytime this icon is updated, we will need to resubmit your app to their respective app stores.</p>
              </Col>
            </Row>
          </Grid>
        </Container>

      </div>
    );
  }
});

module.exports = Assets;
