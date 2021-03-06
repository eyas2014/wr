import logo from './logo.svg';
import React, { Component } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { apiAddress } from '../config.js';

const Image=styled.img`
	height: 200px;
	width: auto;
`;

const Span=styled.span`
	margin-left: 10px;
`;

const P=styled.p`
	color: red;
`;

const Div=styled.div`
	position: absolute;
	right: 300px;
	text-align: left
`;

class Login extends Component {
	constructor(){
		super();
		this.state={incorrectPassword: false};
	}

	submit(){
		fetch(apiAddress+"/authenticate", {
	        method: "POST", 
	        mode: "cors", 
	        cache: "no-cache", 
	        credentials: "same-origin", 
	        headers: {
	            "Content-Type": "application/json; charset=utf-8",	       
	        },
	        redirect: "follow", 
	        referrer: "no-referrer", 
	        body: JSON.stringify(this.state), 
		}).then((response)=>{
			return response.json()
		}).then((data)=>{
			if(data.validated) {
				window.location.href=apiAddress+"#/dashboard/"+this.state.userName;
			}
			else this.setState({incorrectPassword: true});
		})
	}

	_changeHandler(e){
		var input={};
		input[e.target.id]=e.target.value;
		this.setState(input);
	}

	render(){
		return (<div>
					<Image src={logo} alt='logo'></Image>
					<form>
						<Div>
							<p>Default guest account:</p>
							<p>User Name:Yaming Password: a</p>
							<p>User Name:Tom  Password: a</p>
							<p>User Name:Kate  Password: a</p>
						</Div>
				        <TextField
				          id="userName"
				          label="User Name"
				          name="userName"
				          margin="normal"
				          variant="outlined"
				          onChange={(e)=>this._changeHandler(e)}
				        />
				        <br />
				        <TextField
				          id="password"
				          label="Password"
				          type="password"
				          margin="normal"
				          variant="outlined"
				          onChange={(e)=>this._changeHandler(e)}
				        />
				        {this.state.incorrectPassword && <P>incorrect password!</P>}
				        <br />
				        <br />
			            <Button onClick={()=>this.submit()} variant="contained">
			              	<i className="fas fa-sign-in-alt"></i>
			              	<Span>Login</Span>
			   			</Button>
			   			<p><a href="#register">No, I don't have an account</a></p>
			        </form>
				</div>)
	}
}

function mapStateToProps(state){
	return {
		sender: state.sender
	}
}

export default connect(mapStateToProps)(Login);