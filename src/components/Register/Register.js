import React from 'react';
/* params: onRouteChange event handler*/
class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            name: ''
        }
    }
     /**
     * onNameChange triggers the event of filling the input, and updates the name state variable
     * params:
     * event -> the filling input event
     */
    onNameChange = (event) => {
        this.setState({name : event.target.value});
    }
    /**
     * onEmailChange triggers the event of filling the input, and updates the email state variable
     * params:
     * event -> the filling input event
     */
    onEmailChange = (event) => {
        this.setState({email : event.target.value});
    }
    /**
     * onPasswordChange triggers the event of filling the input, and updates the password state variable
     * params:
     * event -> the filling input event
     */
    onPasswordChange = (event) => {
        this.setState({password : event.target.value});
    }
    
    /**
     * onSubmitSignIn fetchs the register route, and sends a post request with the signInEmail ant the
     * signInPassword in the body, it also waits for the success response, and then, changes the route
     * in the App.js state via the onRouteChange function provided as props
     */
    onSubmitSignIn = () => {
        fetch('https://guarded-reef-67910.herokuapp.com/register', {
            method : 'post',
            headers : {'Content-type': 'application/json'},
            body : JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
        .then( response => response.json())
        .then( user => {
            if (user.id){
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        });
    }
    render(){
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 center">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">User Name</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="name"  
                                id="name"
                                onChange = { this.onNameChange }
                                />
                            </div>  
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address"
                                onChange = { this.onEmailChange }
                                />
                            </div>   
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="password"  
                                id="password"
                                onChange = { this.onPasswordChange }
                                />
                            </div>
                            {/* <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/>Remember me</label>*/}
                        </fieldset>
                        <div className="">
                            <input 
                            /** changes the route string when clicked, to 'home' */
                            onClick={this.onSubmitSignIn} 
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value="Register"/>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;