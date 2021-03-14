import React from 'react';
import './CallApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import {secondsToTime} from './Timer'


//var phone_icon =  require ('./phone-icon.png');
export class CallApp extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      input:{
        to:'',
        from:'',
        durationMin:5
      },
      errors:{
        toError:'',
        fromError:''

      },
      apiSuccess:'',
      apiError:'',
      time:{},
      seconds:''
      

    }
    this.serverUrl = process.env.REACT_APP_SERVER_URL;
    this.timer = 0;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.countDown = this.countDown.bind(this);
    console.log("ENV URL", process.env.REACT_APP_SERVER_URL);
  }


  isValidForm(){
    let input = this.state.input;
    let errors = {};
    let isValid = true;
    const toError = this.validateMobNumber(input.to);
    const fromError = this.validateMobNumber(input.from);
    if(toError!=='Valid'){
      isValid = false;
      errors["toError"] = toError;
    }
    if(fromError!=='Valid'){
      isValid = false;
      errors["fromError"] = fromError;
      
    }
    this.setState({errors});
    return isValid;
  }

  validateMobNumber(inputNumber){

    if (typeof inputNumber !== "undefined") {
          
      var pattern = new RegExp(/^[0-9 +\b]+$/);
      if (!pattern.test(inputNumber)) {
       
        return "Please enter only number.";
      }
      // else if(inputNumber.length !==10){
       
      //   return "Please enter valid phone number.";
      // }
    }else{
      return "Field can not be empty";
    }
    return "Valid";
  }

  handleChange(event){
    let input = this.state.input;
    input[event.target.name] = event.target.value;
    this.setState({input});
    // switch(event.target.name){
      
    //   case 'to':{
    //     let input = {
    //       to:event.target.value
    //     }
    //     this.setState({to:event.target.value});
    //     break;
    //   }
    //   case 'from':{
    //     this.setState({from:event.target.value});
    //     break;
    //   }
      
    // }

  
  }


  handleSubmit(event) {

    if(this.isValidForm()){
      //alert('A name was submitted: ' + this.state.input.to, "dfasd", this.state.input.from);
      this.makeTheCall()
    }
    event.preventDefault();
    
    
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
        <div className="Timer">M: {this.state.time.m} S: {this.state.time.s}</div>
        <FontAwesomeIcon className="icon" icon={faPhoneAlt} />
          <p>
            Make a outbound call via browser
          </p>
          <label className="Error">{this.state.apiError}</label>
          <label className="Error" style={{color:'green'}}>{this.state.apiSuccess}</label>
          <form className="Input-form"onSubmit={this.handleSubmit} >
            <div>
              <div className="Input-field">
                <div className="Label">  From number:</div>
                <div className="Input-elem">
                  <input placeholder="Enter from mobile number" type="text" 
                  className="input-txt" name="from"
                  value={this.state.input.from} onChange={this.handleChange}
                   />
                </div>
                <div><label className="Error">{this.state.errors.fromError}</label></div>
              </div>
              <div className="Input-field">
                <div className="Label"> To number:</div>
                <div className="Input-elem">
                  <input type="text" className="input-txt" name="to" 
                     value={this.state.input.to} onChange={this.handleChange}
                     placeholder="Enter to mobile number"
                  />
                </div>
                <div><label className="Error">{this.state.errors.toError}</label></div>
             
              </div>
              <div className="Input-field">
                <label className="Label">
                  Pick call duration:
                </label>
                <div className="Input-elem">
                  <select  name="durationMin" className="input-txt" value={this.state.input.durationMin} onChange={this.handleChange}>
                    <option value="5">5 Min</option>
                    <option value="10">10 Min</option>
                    <option value="15">15 Min</option>
                    <option value="20">20 Min</option>
                  </select>
                </div>
              </div>

              <div className="Input-field">
              <div className="Input-elem">
                <input type="submit" className="input-txt Button" value="Submit"
                disabled={this.state.seconds && this.state.seconds!==0}
                 />
              </div>
              </div>
            </div>
  
          </form>
  
  
        </header>
      </div>
    );
   }

  makeTheCall() {
    this.setState({
      apiSuccess:'',
      apiError:''
    })
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          "to": this.state.input.to,
          "from": this.state.input.from,
          "durationMin":this.state.input.durationMin
        }
      )
    };
    fetch(this.serverUrl+'/createCall', requestOptions)
      .then(response =>{
       response.json()
      } )
      .then((result) => {
        console.log("result", result);
        const durationSec = this.state.input.durationMin*60;
        let respMessage = 'SUCCESS';
        if(this.result ){
          respMessage = result.message;
        }
        this.setState({ apiSuccess: respMessage,seconds:durationSec });
        this.startTimer();
        
      },
        (error) => {
          if (error) {
            this.setState({ apiError: error.toString() });
          }

        });
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }


countDown(){
  // Remove one second, set state so a re-render happens.
  let seconds = this.state.seconds - 1;
  this.setState({
    time: secondsToTime(seconds),
    seconds: seconds,
  });
  
  // Check if we're at zero.
  if (seconds == 0) { 
    clearInterval(this.timer);
  }
}
}



export default CallApp;
