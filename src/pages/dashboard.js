import React, { Component } from 'react';
import HeaderBar from '../components/header-bar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Navigation from '../components/navigation';
import MessageComposer from '../components/message-composer';
import DialogBox from '../components/dialog-box';
import MessageControl from '../components/message-control';
import { connect } from 'react-redux';
import {updateContacts} from '../lib/actions';

const styles={
	background: {
		backgroundColor: '#fff',
	},
	fullHeight:{
		position: 'relative',
		boxShadow: "0px 4px 8px #000",
		height: "100vh",
		overflow: "hidden"
	}, 
	dialogBox: {
		position: 'relative',
		height: "100%",
		backgroundColor: "#fff"
	},
	fullDiv: {
		width: "100%",
		height: "100%"
	},
	fillRemain: {
		position: 'absolute', 
		top: '49px', 
		bottom: '0px', 
		width: "100%",
		zIndex: ""
	},
	nav: {
		backgroundColor: "#cccccc",
		borderRight: "solid 1px #888",
		height: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		boxShadow: "0px 4px 8px #000"
	},
	spinner: {
		width: '40%',
		margin: 'auto',
		marginTop: '20%',
		height: 'auto'
	}
}

class App extends Component {
	componentWillMount(){
		const username=this.props.match.params.username;
		fetch("http://localhost:3000/postLogin", {
	        method: "POST", 
	        mode: "cors", 
	        cache: "no-cache", 
	        credentials: "same-origin", 
	        headers: {
	            "Content-Type": "application/json; charset=utf-8",	       
	        },
	        redirect: "follow", 
	        referrer: "no-referrer", 
	        body: JSON.stringify({username}), 
		}).then((response)=>{
			return response.json()
		}).then((data)=>{
			if(data.validated) {
				this.props.dispatch({type: 'login', 
									name: username, 
									column: data.column, 
									row: data.row});
				this.props.dispatch(updateContacts(username));
			}
			else window.location.href="http://localhost:3000#/login";
		})
	}

	render(){
		const { classes, numberSelected, receiver} =this.props;
		return (
			<Grid container justify='center' className={classes.background}>
				<Grid item xs={12} md={8} className={classes.fullHeight}>
					<HeaderBar></HeaderBar>
					<div className={classes.fillRemain}>
						<Grid container  className={classes.fullDiv}>
							<Grid item xs={3} className={classes.nav}>
								<Navigation></Navigation>
							</Grid>
							<Grid item xs={9}   className={classes.dialogBox}>
								<DialogBox></DialogBox>
								{numberSelected!==0&&<MessageControl></MessageControl>}
								{receiver&&numberSelected===0&&<MessageComposer></MessageComposer>}
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Grid>)

	}

}

const mapStateToProps=function (state){
	return {numberSelected: state.numberSelected,
			receiver: state.receiver}
}

const AppWithStyles=withStyles(styles)(App);

export default connect(mapStateToProps)(AppWithStyles);