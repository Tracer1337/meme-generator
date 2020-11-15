import React, { useContext, useEffect } from "react"
import { MemoryRouter, Switch, Route, Redirect, useHistory } from "react-router-dom"

import { AppContext } from "../App.js"
import { createListeners } from "../utils/index.js"
import Layout from "../components/Layout/Layout.js"
import BackButtonHandler from "../utils/BackButtonHandler.js"
import SwipeableRoutes from "./SwipeableRoutes.js"
import ProtectedRoute from "./ProtectedRoute.js"

import FeedPage from "../Pages/FeedPage.js"
import EditorPage from "../Pages/EditorPage.js"
import ExplorePage from "../Pages/ExplorePage.js"

function HistoryHandler() {
    const context = useContext(AppContext)

    const history = useHistory()

    useEffect(() => {
        return createListeners(context, [
            ["backButton", history.goBack]
        ])
    })

    return null
}

function Router() {
    const context = useContext(AppContext)

    return (
        <MemoryRouter>
            <Layout>
                <SwipeableRoutes>
                    <ProtectedRoute path="/feed">
                        <FeedPage/>
                    </ProtectedRoute>

                    <EditorPage path="/editor"/>

                    <ProtectedRoute path="/explore">
                        <ExplorePage/>
                    </ProtectedRoute>
                </SwipeableRoutes>
            </Layout>

            <Switch>
                <Route exact path="/">
                    <Redirect to="/editor"/>
                </Route>
            </Switch>

            <BackButtonHandler onBackButton={() => context.dispatchEvent("backButton")}/>
            <HistoryHandler/>
        </MemoryRouter>
    )
}

export default Router