import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { Route, Redirect, Router} from 'react-router-dom';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import PropTypes from "prop-types";
import { Grid, Button } from '@material-ui/core';
import {Front} from "../api/minimongo.js";
import { Wager } from "../api/wager.js"



class AcceptorDecline extends Component {

    constructor(props) {
        super(props);
        this.state={
            tickerSymbolInputInput:"",
            statechange:"AcceptedChallenge",
            id:""
        }
        this.onClick = this.onClick.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);

    }


    //accept
    onClick(event) {
        event.preventDefault();
        Meteor.call("wager.updatechallengeestate",this.state.statechange,this.props.challenger[0]._id, (err, res)=>{
            if (err) {
                alert("Error inserting challengee");
                console.log(err);
                return;
            }

            else{
                this.props.history.push({
                    pathname: "/multibetchallengee/"+ this.props.challenger[0].challenger,
                    state: { thechallenger: this.props.challenger[0].challenger,
                        tickerSymbolInputInput: this.props.challenger[0].tickerSymbolInputInput,
                        _id:this.props.challenger[0]._id,
                        statechange:this.props.challenger[0].state}});

                //console.log(res + "has been inserted");

            }

        });




    }



    onChange(evt) {
        console.log(Meteor.user().username, evt.target.value);
        this.setState({
            challengee: evt.target.value
        });
    }
    //decline
    buttonClicked(event){
        event.preventDefault();
        Meteor.call("wager.deletechallenger",this.state.challenger,(err,res)=> {
            if (err) {
                alert("There was an deleting challenger");
                console.log(err);
                return;
            }
            else{
                // console.log("Challenger has been deleted");
            }

        });
        this.props.history.push("/profile");


    }
    render() {
        console.log("This.props" , this.props)
        return(
            /*if there are challenges render this page else render NoChallenge page*/
            <div className="container-fluid" role="main">
                <div className="yourChallenges" >
                    <div className="body">
                        <div className="row">
                            <div className="col s12 m6">Youve been challenged by </div>
                            <Button id="accept" variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.onClick}>Accept</Button>
                            <Button id="decline" variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.buttonClicked}>Decline</Button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

/*export default withTracker (() => {
  return {
    challenger: Meteor.user(),
    //challenger: Front.find({_id:{$ne:Meteor.userId()}},{sort:{'user': 1}}).fetch(),
  }
})(withRouter(AcceptorDecline));*/
AcceptorDecline.propTypes = {
    challenger: PropTypes.arrayOf(PropTypes.object).isRequired
};
export default withTracker (() => {
    const handle = Meteor.subscribe("wager");

    return {
        challenger: Wager.find({}).fetch(),
        user: Meteor.user(),
        ready : handle.ready()
    }
})(withRouter(AcceptorDecline));
