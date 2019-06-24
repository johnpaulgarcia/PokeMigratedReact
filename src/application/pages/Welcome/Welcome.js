import React, { Component,Fragment } from 'react';
import { Link } from 'react-router-dom';
import pokemon from '../../assets/pokemon.png'
export default class Welcome extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
                <Fragment>
                <div className="top-shifter poke-wc">
                  <img src={pokemon} class="pokemon-logo"/>
                </div>

                <div class="poke-wc">
                   
                    <Link to="/hometown">
                    <button class="start">
                        Start Poke Hunt
                    </button>
                    </Link>
                </div>
                </Fragment>
                
            

        );
    }
}