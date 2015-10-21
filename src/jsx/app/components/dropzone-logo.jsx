var React = require('react');

var LogoDropzone = React.createClass({
  getInitialState: function() {
    return {
      stations: []
    }
  },
  componentDidMount: function() {
    $('#logo-dropzone').dropzone({
      paramName: "filedz", // The name that will be used to transfer the file
      maxFilesize: 6, // MB
      dictDefaultMessage: '+ drag image here to upload',
      accept: (file, done) => {
        done();
      }
    });
  },
  render: function () {
    return (
      <div>
        <Form action='/dropzone/file-upload/logo' className='dropzone' id='logo-dropzone'>
        </Form>
      </div>
    );
  }
});

module.exports = LogoDropzone;
