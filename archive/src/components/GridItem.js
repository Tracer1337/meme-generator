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

    const path = "/nudes/" + image

    const link = `${window.location.protocol}//${window.location.host}${path.replace(/\..*/, "")}`

    return (
        <div className="card grid-item">
            <a className="modal-trigger" href={"#" + image}>
                <div className="card-image">
                    <img src={path}/>
                </div>
            </a>

            <div id={image} className="modal" ref={modalRef}>
                <div className="modal-content center-align">
                    <img src={path} ref={modalImageRef} style={modalImageDimension}/>
                </div>

                <div className="modal-footer">
                    <div className="card-action" style={{
                        padding: 8,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <CopyToClipboard text={link} onCopy={handleCopy}>
                            <a className="pointer teal-text text-lighten-2" style={{
                                margin: 0,
                                height: 16
                            }}>Copy Link</a>
                        </CopyToClipboard>

                        <a className="pointer teal-text text-lighten-2" href={path} download style={{
                            margin: 0,
                            marginLeft: 24,
                            height: 16
                        }}>Download</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GridItem