import React, { Component } from 'react';
import axios from 'axios';
import "./App.css";
import Modal from 'react-awesome-modal';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      success : false,
      url : "",
      visible: false
    }
  }

  openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

  handleChange = (ev) => {
    this.setState({success: false, url : ""});

  }
  // Perform the upload
  handleUpload = (ev) => {
    let file = this.uploadInput.files[0];
    // Split the filename to get the name and type
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("Preparing the upload");
    console.log("file name is ", fileName);
    console.log("file type is ", fileType);

    axios.post("http://localhost:5000/api/imageUpload",{
      fileName : fileName,
      fileType : fileType
    })
    .then(response => {
      console.log("got here");
      var returnData = response.data.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      this.setState({url: url})
      console.log("Recieved url " + url);

      console.log("Recieved a signed request " + signedRequest);

     // Put the fileType in the headers for the upload
      var options = {
        headers: {
          'Content-Type': fileType
        }
      };
      axios.put(signedRequest,file,options)
      .then(result => {
        console.log("Response from s3")
        this.setState({success: true});
      })
      .catch(error => {
        alert("ERROR " + JSON.stringify(error));
      })
    })
    .catch(error => {
      alert(JSON.stringify(error));
    })
  }


  render() {
    const Success_message = () => (
      <div style={{padding:50}}>
        <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
        <a href={this.state.url}>Access the file here</a>
        <br/>
      </div>
    )
    return (
      <div className="App">
      {/*
      <section>
              <h1>React-Modal Examples</h1>
              <input type="button" value="Open" onClick={() => this.openModal()} />
              <Modal
                  visible={this.state.visible}
                  width="400"
                  height="300"
                  effect="fadeInUp"
                  onClickAway={() => this.closeModal()}
              >
                  <div>
                      <h1>Title</h1>
                      <p>Some Contents</p>
                      <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                  </div>
              </Modal>
          </section>*/}
          <Modal
              visible={this.state.visible}
              width="400"
              height="300"
              effect="fadeInUp"
              onClickAway={() => this.closeModal()}
          >
              <div className='modalContentCenter'>
                  <div id='firstModalLine'>
                  <button className='font-weight-bold'>View picture</button>
                  </div>
                  <hr style={{'vertical-align': 'middle'}} />
                  <div id='secondModalLine'>
                  <button className='font-weight-bold mb-3'>Change picture</button>
                  <input id='hiddenInput' onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
                  </div>
                  <br />
                  <a href="javascript:void(0);" onClick={() => this.closeModal()} id="closeModalButton">Close</a>
              </div>
          </Modal>
        <center>
          <h1>UPLOAD A FILE</h1>
          {this.state.success ? <Success_message/> : null}
          <div className="container">
            <img className="avatar" src={this.state.url ? this.state.url : "https://bbprofileimage.s3.amazonaws.com/mypic"} />
            <button className="btn" value="Open" onClick={() => this.openModal()}></button>
          </div>

          <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
          <br/>
          <button onClick={this.handleUpload}>UPLOAD</button>
        </center>
      </div>
    );
  }
}
export default App;
