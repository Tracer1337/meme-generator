import { useContext, useEffect, useState } from "react"
import ReactGA from "react-ga"

import { AppContext } from "../App.js"
import { GA_TRACKING_ID, IS_DEV } from "../config/constants.js"

function Analytics() {
    const context = useContext(AppContext)
    const [isInitialized, setIsInitialized] = useState(false)

    /**
     * Initialize GA
     */
    useEffect(() => {
        if (context.password || IS_DEV) {
            return
        }

        ReactGA.initialize(GA_TRACKING_ID)

        ReactGA.pageview(window.location.pathname)

        setIsInitialized(true)

        // eslint-disable-next-line
    }, [])

    /**
     * Forward events to GA
     */
    useEffect(() => {
        if (!isInitialized) {
            return
        }

        const generateImageEvent = ReactGA.event.bind(null, {
            category: "Editor",
            action: "Generate Image",
            ...(context.currentTemplate ? {
                label: context.currentTemplate.label,
                value: context.currentTemplate.id
            } : {})
        })

        const loadTemplateEvent = ({ detail: { template } }) => ReactGA.event({
            category: "Editor",
            action: "Load Template",
            label: template.label,
            value: template.id
        })

        const shareModalModalview = () => ReactGA.modalview("share")

        const uploadImageEvent = ({ detail: { link } }) => ReactGA.event({
            category: "Editor",
            action: "Upload Image",
            label: link
        })

        const downloadImageEvent = () => ReactGA.event({
            category: "Editor",
            action: "Download Image"
        })

        const shareEvent = ({ detail: { label } }) => ReactGA.event({
            category: "Editor",
            action: "Share",
            label
        })

        context.event.addEventListener("generateImage", generateImageEvent)
        context.event.addEventListener("loadTemplate", loadTemplateEvent)
        context.event.addEventListener("openShareModal", shareModalModalview)
        context.event.addEventListener("uploadImage", uploadImageEvent)
        context.event.addEventListener("downloadImage", downloadImageEvent)
        context.event.addEventListener("share", shareEvent)

        return () => {
            context.event.removeEventListener("generateImage", generateImageEvent)
            context.event.removeEventListener("loadTemplate", loadTemplateEvent)
            context.event.removeEventListener("openShareModal", shareModalModalview)
            context.event.removeEventListener("uploadImage", uploadImageEvent)
            context.event.removeEventListener("downloadImage", downloadImageEvent)
            context.event.removeEventListener("share", shareEvent)
        }
    }, [context, isInitialized])

    return null
}

export default Analytics