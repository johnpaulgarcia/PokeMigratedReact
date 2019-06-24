import React, { Component } from 'react';
import { Switch,HashRouter,Route } from 'react-router-dom';
import Container from './components/Container';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
export default class index extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <Container>
                <HashRouter>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={Welcome}
                            />

                            <Route 
                            path="/hometown"
                            component={Home}
                            />
                    </Switch>
                </HashRouter>
            </Container>
        );
    }
}