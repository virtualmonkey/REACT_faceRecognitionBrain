import React from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import 'tachyons';



/* used to determine Particles's class behavior */
const particlesOptions = {
  particles: {
    number:{
        value: 150,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
};

/* since this is a state component, we export a class instead of a pure function */
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user : {
    id : '',
    name : '',
    email: '',
    entries : '',
    join: ''
  }
}
class App extends React.Component{
  constructor(){
    super();
    this.state = initialState;
  };

  componentDidMount(){
    // fetch the roor route from the server running the server.js script
    // data should be all the users, as a json
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => console.log(data));
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
    
  }
  /** calculates the position where the face box will have its corners */
  /** params: data is the object of the Clairifai API response */
  /** return: an object whom the attributes are the four corners of the face */
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // DOM manipulation
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // changes the box state, 
  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  /** triggers the event when onInputChange is called in ImageLinkForm(that receives the methods as props)
   *  input is changed in this.state
  */
  onInputChange = (event) =>{
    this.setState({input: event.target.value})
  }

  /**  triggers the click when onButtonSubmit is called in ImageLinkForm(that receives the methods as props) 
   * imageUrl is changed in this.state, and then it is passed to the predict method that Clairifai provides 
  */
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://guarded-reef-67910.herokuapp.com/imageurl', {
      method : 'post',
      headers : {'Content-type': 'application/json'},
      body : JSON.stringify({
        input: this.state.input,
      })
    })
    .then(response => response.json())    
    .then(response => {
      if (response){
        fetch('https://guarded-reef-67910.herokuapp.com/image', {
            method : 'put',
            headers : {'Content-type': 'application/json'},
            body : JSON.stringify({
                id: this.state.user.id,
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count }));   
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    }).catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState);
    } else if (route === 'home'){
      this.setState({isSignedIn:'true'});
    }
    this.setState({route: route});
  }
  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { this.state.route === 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              /* sending the methods to the ImageLinkForm component as Props */
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition
              /* sending the box onject from this.state to FaceRecognition component as props*/
              box = {this.state.box}
              /* sending the imageUrl from this.state to FaceRecognitionComponent as props */
              imageUrl={this.state.imageUrl}/>
            </div>
          : ( this.state.route === 'signin'
            ? <Signin loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
          )
      }       
    </div>
    );  
  }
}
export default App;
