import React, { useEffect, useRef } from "react"

import { ADSENSE_CLIENT_ID } from "../config/constants.js"

function AdSense(props) {
    const elementRef = useRef()

    useEffect(() => {
        (async () => {
            await new Promise(requestAnimationFrame)

            if (window) {
                if (!window.adsbygoogle) {
                    window.adsbygoogle = []
                }

                window.adsbygoogle.push({})
            }

            /**
             * Remove > height: auto !important < styles
             */
            let found = false

            while (!found) {
                let element = elementRef.current

                while (element.parentElement) {
                    element = element.parentElement
    
                    if (element.style.height === "auto" && element.style.getPropertyPriority("height") === "important") {
                        element.style.height = ""
                        found = true
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 100))
            }
        })()
    }, [])

    return (
        <ins 
            className={"adsbygoogle" + (props.className ? " " + props.className : "")}
            style={{
                display: "block",
                ...props.style
            }}
            data-ad-client={props.client || ADSENSE_CLIENT_ID}
            data-ad-slot={props.slot}
            data-ad-layout={props.layout}
            data-ad-layout-key={props.layoutKey}
            data-ad-format={props.format}
            data-full-width-responsive={props.responsive}
            ref={elementRef}
        />
    )
}

export default AdSense