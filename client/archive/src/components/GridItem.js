import React, { useState, useEffect, useRef } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { getModalImageDimensions } from "../utils"

const password = localStorage.getItem("password")

function GridItem({ image, reload, isHidden }) {
    const modalRef = useRef()
    const modalImageRef = useRef()

    const [modalImageDimension, setModalImageDimension] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const path = "/nudes/" + image

    const link = `${window.location.protocol}//${window.location.host}${path.replace(/\..*/, "")}`

    const resizeImage = async () => {
        setModalImageDimension(await getModalImageDimensions(image))
    }

    const handleCopy = () => {
        M.toast({ html: "Copied to clipboard", displayLength: 1000 })
    }

    const handleHideSuccess = () => {
        M.toast({ html: "Image hidden", displayLength: 1000 })
        setIsModalOpen(false)
        reload()
    }

    const handleShowSuccess = () => {
        M.toast({ html: "Image exposed", displayLength: 1000 })
        setIsModalOpen(false)
        reload()
    }

    const handleError = () => {
        M.toast({ html: "Error", displayLength: 1000 })
        setIsModalOpen(false)
        reload()
    }

    const handleHide = () => {
        fetch("/upload/" + image, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": password
            },
            
            body: JSON.stringify({
                is_hidden: 1
            })
        })
        .then(handleHideSuccess)
            .catch(handleError)
    }

    const handleShow = () => {
        fetch("/upload/" + image, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                password,
                is_hidden: 0
            })
        })
        .then(handleShowSuccess)
        .catch(handleError)
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

    useEffect(() => {
        const checkClickOutside = (event) => {
            const hasClickedOutside = !event.target.contains(modalRef.current)

            if (hasClickedOutside) {
                setIsModalOpen(false)
                document.removeEventListener("click", checkClickOutside)
            }
        }

        if (isModalOpen) {
            M.Modal.getInstance(modalRef.current).open()

            document.addEventListener("click", checkClickOutside)
        } else {
            M.Modal.getInstance(modalRef.current).close()
        }
    }, [isModalOpen])

    return (
        <div className="card grid-item" style={{
            opacity: isHidden && !isModalOpen ? .5 : 1
        }}>
            <a className="pointer" onClick={() => setIsModalOpen(true)}>
                <div className="card-image">
                    <img src={path}/>
                </div>
            </a>

            <div className="modal" ref={modalRef}>
                <div className="modal-content center-align">
                    <img src={path} ref={modalImageRef} style={modalImageDimension}/>
                </div>

                <div className="modal-footer">
                    <div className="card-action" style={{
                        padding: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <div>
                            { password && (
                                isHidden ? (
                                    <a className="pointer teal-text text-lighten-2" onClick={handleShow} style={{
                                        margin: 0,
                                        height: 16
                                    }}>Show</a>
                                ) : (
                                    <a className="pointer teal-text text-lighten-2" onClick={handleHide} style={{
                                        margin: 0,
                                        height: 16
                                    }}>Hide</a>
                                )
                            ) }
                        </div>

                        <div>
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
        </div>
    )
}

export default GridItem