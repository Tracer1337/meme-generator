import React, { useState, useEffect, useRef, useContext, useReducer } from "react"
import { useTheme } from "@material-ui/core"

import { AppContext } from "../../App.js"
import DialogHandle from "../../Models/DialogHandle.js"
import { createListeners } from "../../utils"

import AddFriendsDialog from "./AddFriendsDialog.js"
import BaseElementsDialog from "./BaseElementsDialog.js"
import BorderDialog from "./BorderDialog.js"
import ConfirmDialog from "./ConfirmDialog.js"
import GridDialog from "./GridDialog.js"
import HelpDialog from "./HelpDialog.js"
import ImageDialog from "./ImageDialog.js"
import ImageSettingsDialog from "./ImageSettingsDialog.js"
import MyFriendsDialog from "./MyFriendsDialog.js"
import PrivacyDialog from "./PrivacyDialog.js"
import ProfileDialog from "./ProfileDialog.js"
import RectangleSettingsDialog from "./RectangleSettingsDialog.js"
import SettingsDialog from "./SettingsDialog.js"
import ShareDialog from "./ShareDialog.js"
import TemplatesDialog from "./TemplatesDialog.js"
import TermsDialog from "./TermsDialog.js"
import TextboxSettingsDialog from "./TextboxSettingsDialog.js"

const dialogsMap = {
    "AddFriends": AddFriendsDialog,
    "BaseElements": BaseElementsDialog,
    "Border": BorderDialog,
    "Confirm": ConfirmDialog,
    "Grid": GridDialog,
    "Help": HelpDialog,
    "Image": ImageDialog,
    "ImageSettings": ImageSettingsDialog,
    "MyFriends": MyFriendsDialog,
    "Privacy": PrivacyDialog,
    "Profile": ProfileDialog,
    "RectangleSettings": RectangleSettingsDialog,
    "Settings": SettingsDialog,
    "Share": ShareDialog,
    "Templates": TemplatesDialog,
    "Terms": TermsDialog,
    "TextboxSettings": TextboxSettingsDialog
}

function DialogHandler() {
    const context = useContext(AppContext)

    const theme = useTheme()

    const idCounter = useRef(0)

    const [dialogs, setDialogs] = useState([])

    // eslint-disable-next-line
    const [updateKey, update] = useReducer(key => key + 1, 0)

    const close = (dialog) => {
        dialog.isOpen = false
        setDialogs([...dialogs])

        setTimeout(() => {
            const newDialogs = dialogs.filter(({ id }) => dialog.id !== id)
            setDialogs(newDialogs)
        }, theme.transitions.duration.leavingScreen)
    }

    const closeAll = () => {
        dialogs.forEach(dialog => dialog.isOpen = false)
        setDialogs([...dialogs])

        setTimeout(() => setDialogs([]), theme.transitions.duration.leavingScreen)
    }

    useEffect(() => {
        context.openDialog = (name, data) => {
            if (!dialogsMap[name]) {
                throw new Error(`The dialog '${name}' does not exist`)
            }

            const newDialog = new DialogHandle({
                element: dialogsMap[name],
                data,
                id: idCounter.current++
            })
            
            setDialogs([...dialogs, newDialog])

            return newDialog
        }

        const boundCreateListeners = createListeners.bind({
            addEventListener: "addListener",
            removeEventListener: "removeListener"
        })

        const removeListeners = dialogs.map(dialog => boundCreateListeners(dialog, [
            ["update", update],
            ["close", () => close(dialog)]
        ]))

        return () => removeListeners.forEach(fn => fn())
    })

    useEffect(() => {
        return createListeners(context.event, [
            ["loadTemplate", closeAll]
        ])
    })

    return dialogs.map((dialog) => (
        React.createElement(dialog.element, {
            open: dialog.isOpen,
            onClose: (...args) => dialog.dispatch("close", args),
            key: dialog.id,
            ...dialog.data
        })
    ))
}

export default DialogHandler