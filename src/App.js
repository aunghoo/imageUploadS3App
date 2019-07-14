import React, { Component } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:5000/';

class App extends Component {
constructor(props) {
  super(props);
  this.state = {
    images: [],
    imageUrls: [],
    message: ''
  }
}
selectImages = (event) => {
  let images = []
  for (var i = 0; i < event.target.files.length; i++) {
    images[i] = event.target.files.item(i);
  }
  images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
  let message = `${images.length} valid image(s) selected`
  this.setState({ images, message })
}

uploadImages = () => {
  const uploaders = this.state.images.map(image => {
    const data = new FormData();
    console.log("got here");
    data.append("image", image, image.name);

    // Make an AJAX upload request using Axios
    return axios.post(BASE_URL + 'api/imageUpload', data)
    .then(response => {
      this.setState({
        imageUrls: [ response.data.imageUrl, ...this.state.imageUrls ]
      });
      console.log(response.data.imageUrl);
    })
  });

  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    console.log('done');
    }).catch(err => alert(err.message));
}

render() {
  return (
    <div>
      <h1>Image Uploader</h1><hr/>
      <form onSubmit={this.submitFormOnClick}>
        <div className="modal-body">
          <div className="">
            <label className="profileFormLabel" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              name="username"
            />
          </div>
          <div className="">
            <label className="profileFormLabel" htmlFor="title">
              Profession
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              name="title"
            />
          </div>
          <div className="col-sm-12">
            <p>Upload Image</p><hr/>
            <div className="col-sm-4">
              <input className="form-control " type="file"
                onChange={this.selectImages} multiple/>
            </div>
            <p className="text-info">{this.state.message}</p>
            <br/>
          </div>
        </div>
        <div className="modal-footer">
          <div className="flex-row">
            <button type="submit" value="Submit" className="btn btn-dark" onClick={this.uploadImages}>
              Submit
            </button>
          </div>
        </div>
      </form>

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/><br/>

      <div className="row col-lg-12">
        {
        this.state.imageUrls.map((url, i) => (
          <div className="col-lg-2" key={i}>
            <img src={BASE_URL + url} className="img-rounded img-responsive"
            alt="not available"/><br/>
          </div>
        ))
        }
      </div>
    </div>
  );
  }
}
export default App;
