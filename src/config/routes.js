import { React } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loginpage from "./../pages/LoginPage"
import GamePage from './../pages/GamePage';
import ViewPage from './../pages/ViewPage';

const Routes = (props) => {
    return (
        <Switch>
            <Route path="/game/">
                <GamePage {...props} />
            </Route>
            <Route path="/view/">
                <ViewPage {...props} />
            </Route>
            <Route path="/">
                <Loginpage />
            </Route>
        </Switch>
    )
}

export default Routes;