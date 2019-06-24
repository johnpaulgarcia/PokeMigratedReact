import React, { Component } from 'react';
import Container from '../../components/Container';
import pokemon from '../../assets/pokemon.png'
export default class Welcome extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <Container>
                <div className="top-shifter poke-wc">
                  <img src={pokemon} class="pokemon-logo"/>
                </div>

                <div class="poke-wc">
                   

                    <button class="start">
                        Start Poke Hunt
                    </button>
                </div>

                
            </Container>

        );
    }
}