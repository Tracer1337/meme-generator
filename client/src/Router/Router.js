import React from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute.js"
import EditorPage from "../Pages/EditorPage.js"
import LoginPage from "../Pages/LoginPage.js"
import RegisterPage from "../Pages/RegisterPage.js"
import FeedPage from "../Pages/FeedPage.js"
import ExplorePage from "../Pages/ExplorePage.js"

function Router() {
    return (
        <HashRouter basename={process.env.REACT_APP_ROUTER_BASE || "/"}>
            <Switch>
                <Route path="/login">
                    <LoginPage/>
                </Route>

                <Route path="/register">
                    <RegisterPage/>
                </Route>

                <ProtectedRoute path="/feed">
                    <FeedPage/>
                </ProtectedRoute>

                <ProtectedRoute path="/explore">
                    <ExplorePage/>
                </ProtectedRoute>

                <Route path="/editor">
                    <EditorPage/>
                </Route>

                <Route path="/">
                    <Redirect to="/editor"/>
                </Route>
            </Switch>
        </HashRouter>
    )
}

export default Router