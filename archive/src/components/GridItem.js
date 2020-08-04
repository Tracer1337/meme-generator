import React, { useState, useEffect, useRef } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { getModalImageDimensions } from "../utils"

function GridItem({ image }) {
    const modalRef = useRef()
    const modalImageRef = useRef()

    const [modalImageDimension, setModalImageDimension] = useState()

    const resizeImage = async () => {
        setModalImageDimension(await getModalImageDimensions(image))
    }

    useEffect(() => {
        M.Modal.init(modalRef.current)
    }, [modalRef])

    useEffect(() => {
        if (!modalImageDimension) {
            resizeImage()
        }

        window.addEventListener("resize", resizeImage)

        return () => {
            window.removeEventListener("resize", resizeImage)
        }
    })

    const handleCopy = () => {
        M.toast({ html: "Copied to clipboard", displayLength: 1000 })
    }

    const link = `${window.location.protocol}//${window.location.host}/nudes/${image.replace(/\..*/, "")}`

    return (
        <div className="card grid-item">
            <a className="modal-trigger" href={"#" + image}>
                <div className="card-image">
                    <img src={"/upload/" + image} loading="lazy"></img>
                </div>
            </a>

            <div id={image} className="modal" ref={modalRef}>
                <div className="modal-content center-align">
                    <img src={"/upload/" + image} ref={modalImageRef} style={modalImageDimension}/>
                </div>

                <div className="modal-footer">
                    <div className="card-action" style={{
                        padding: 8,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <CopyToClipboard text={link} onCopy={handleCopy}>
                            <a className="pointer teal-text text-lighten-2" style={{
                                margin: 0,
                                height: 16
                            }}>Copy Link</a>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GridItem