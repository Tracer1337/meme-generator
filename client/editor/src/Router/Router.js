import React from "react"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

import EditorPage from "../Pages/EditorPage.js"
import LoginPage from "../Pages/LoginPage.js"
import RegisterPage from "../Pages/RegisterPage.js"

function Router() {
    return (
        <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || "/"}>
            <Switch>
                <Route path="/login">
                    <LoginPage/>
                </Route>

                <Route path="/register">
                    <RegisterPage/>
                </Route>

                <Route path="/profile">
                    <Redirect to="/"/>
                </Route>

                <Route path="/">
                    <EditorPage/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router