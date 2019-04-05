import React from 'react';
import { Link } from 'react-router-dom';
//import 

class NavBar extends React.Component {
    constructor(props){
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    logoutUser(e){
        e.preventDefault();
        this.props.logout();
    }

    //selectively render links based on if user is logged in

    getLink(){
        if(this.props.isLoggedIn){
            return (
              <div>
                <Link to={"/tweets"}>All Tweets</Link>
                <Link to={"/profile"}>Profile</Link>
                    <Link to={'/tweets'}>All Tweets</Link>
              </div>
            );
        }
    }

}