import { combineReducers } from 'redux';


function sender(state='', action){
	if(action.type==="login"){
		state=action.username
	}
	return state;
}


function receiver(state='', action){
	if(action.type==="refetchStart"){
		state=action.receiver;
	}
	return state;
}


function contacts(state={loading: true, data:[]}, action){
	if(action.type==="requestContacts"){
		state={loading:true, data:[]}
	}
	if(action.type==="loadContacts"){
		state={loading:false, data:action.contacts}
	}
	return state;
}

function scrollBox(state=false, action){
	switch(action.type){
		case 'scrollStart':
			state=true;
			break;
		case 'scrollEnd':
			state=false;
			break;
		default:
	}
	return state;
}


//actions: sendNewMessage, sentToServer, sentToReceiver, deleteMessage, deleteSuccess

function dialog(state=[], action){
	const {message, deleteTimer, sender, clientTime}=action;
	var newMessage;
	switch(action.type){
		case 'receiveNewMessage':
			const timerStart=new Date().getTime();
			newMessage={message, deleteTimer, selected: false, sender, timerStart, clientTime, status: 'receivedMessage'};
			state=[...state, newMessage];
			break;
		case 'sendNewMessage':
			newMessage={message, deleteTimer, selected: false, sender, clientTime, status: action.status||'composed'};
			state=[...state, newMessage];
			break;

		case 'toggleMessage':
			state=state.reduce((acc, cur)=>{
					if(cur.clientTime===action.clientTime&&cur.sender===action.sender) {
						cur=Object.assign({}, cur, {selected: !cur.selected});
						acc.push(cur);
					}else{
						acc.push(cur);
					};
					return acc;
				}, []);
			break;
		case 'deleteMessages': 
			state=state.reduce((acc, cur)=>{
					if(cur.selected) {
						cur=Object.assign({},cur, {selected: false, status: 'deleting'});
						acc.push(cur);
					} 
					else acc.push(cur);
					return acc;
				}, []);
			break;

		case 'receiveDeleteMessages': 
			action.list.forEach((item)=>{
				state=state.reduce((acc, cur)=>{
						if(cur.clientTime!==item.clientTime||cur.sender!==item.sender) {
							acc.push(cur);
						};
						return acc;
					}, []);
			});
			break;

		case 'deleteSuccess': 
			console.log(action.list, state);
			action.list.forEach((item)=>{
				state=state.reduce((acc, cur)=>{
						if(cur.clientTime!==item.clientTime||cur.sender!==item.sender) {
							acc.push(cur);
						};
						return acc;
					}, []);
			});
			break;
		case 'cancelSelect': 
			state=state.reduce((acc, cur)=>{
						cur=Object.assign({}, cur, {selected: false});
						acc.push(cur);
						return acc;
				}, []);
			break;
		case 'removeTimeout':
			state=state.reduce((acc, cur)=>{
					if(cur.timerStart&&cur.deleteTimer!=='forever'){
						var timeLeft=cur.deleteTimer*1000-(action.currentTime-cur.timerStart);
						if(timeLeft>0) acc.push(cur);
						console.log('aa');
					}
					else acc.push(cur);
					return acc;
				}, []);
			console.log(state);
			break;
		case 'sentToReceiver':
			state=state.reduce((acc, cur)=>{
					if(!cur.timerStart&&cur.clientTime===action.clientTime)	{
						cur.timerStart=new Date();
						cur.status='sentToReceiver';
					}
					acc.push(cur);
					return acc;
				}, []);
			break;

		case 'refetchStart':
			state=[];
			break;

		case 'refetchSuccess':
			state=action.messages;
			break;

		case 'sentToServer':
			state=state.reduce((acc, cur)=>{
					if(cur.sender===action.sender&&cur.clientTime===action.clientTime)	{
						cur.status='sentToServer';
					}
					acc.push(cur);
					return acc;
				}, []);
			break;
		default:
	}

	return state;
}


function numberSelected(state=0, action){
	if(action.type==="toggleMessage") {
		if(action.selected)state++;
		else state--;
	}
	if(action.type==="deleteMessages") state=0;
	if(action.type==="refetchStart") state=0;
	if(action.type==="deleteSuccess") state=0;
	if(action.type==="cancelSelect") state=0;
	return state
}

function searchContacts(state='', action){
	if(action.type==="searchContacts"){
		state=action.str}
	return state;
}

function modifications(state=[], action){
	if(action.type==="newMessage"||action.type==="deleteMessages") state.push(action);
	return state
}

function putEvents(state=[], action){
	if(action.type==="sendNewMessage"||action.type==="deleteMessage"){
		state.push(action)
	}
	else if (action.type==="resetEvents"){
		state=[]
	}
	return state;
}


const Reducers=combineReducers({contacts, sender, receiver, dialog, putEvents,
						scrollBox, numberSelected, searchContacts, modifications});

export default Reducers;