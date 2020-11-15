import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, Tabs, Tab } from "@material-ui/core"
import SwipeableViews from "react-swipeable-views"

import LoginForm from "../Forms/LoginForm.js"
import RegisterForm from "../Forms/RegisterForm.js"

function AuthDialog({ onClose, open }) {
    const [currentTab, setCurrentTab] = useState(0)

    return (
        <Dialog onClose={onClose} open={open}>
            <Tabs value={currentTab} onChange={(_, i) => setCurrentTab(i)} variant="fullWidth">
                <Tab label="Login"/>
                <Tab label="Register"/>
            </Tabs>

            <DialogContent>
                <SwipeableViews index={currentTab} onChangeIndex={setCurrentTab} animateHeight>
                    <LoginForm onLogin={onClose}/>
                    <RegisterForm onRegister={onClose}/>
                </SwipeableViews>
            </DialogContent>
        </Dialog>
    )
}

export default AuthDialog