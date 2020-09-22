import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute.js"
import EditorPage from "../Pages/EditorPage.js"
import LoginPage from "../Pages/LoginPage.js"
import RegisterPage from "../Pages/RegisterPage.js"
import ProfilePage from "../Pages/ProfilePage.js"
import FeedPage from "../Pages/FeedPage.js"

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

                <ProtectedRoute path="/profile">
                    <ProfilePage/>
                </ProtectedRoute>

                <ProtectedRoute path="/feed">
                    <FeedPage/>
                </ProtectedRoute>

                <Route path="/">
                    <EditorPage/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router