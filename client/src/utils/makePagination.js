import React, { useState, useRef, useImperativeHandle, useEffect } from "react"
import { CircularProgress, Typography } from "@material-ui/core"

import useAPIData from "./useAPIData.js"
import { createListeners } from "./index.js"

function makePagination(method, Child) {
    const Page = React.forwardRef(function ({ page = 0, ...props }, ref) {
        const nextPageRef = useRef()
        
        const [hasChild, setHasChild] = useState(false)
        
        const { data, isLoading, reload } = useAPIData({
            method,
            data: {
                page,
                ...(props.apiData || {})
            }
        })
        
        const destroy = () => {
            if (nextPageRef.current) {
                nextPageRef.current.destroy()
            }
            setHasChild(false)
        }

        useEffect(() => {
            return createListeners(window, [])
        })

        useImperativeHandle(ref, () => ({
            reload: () => {
                destroy()
                reload()
            },
            
            destroy
        }))

        if (isLoading) {
            return <CircularProgress/>
        }

        if (!data) {
            return <Typography>Could not load data</Typography>
        }

        return (
            <>
                <Child data={data} onLoadNextPage={() => setHasChild(true)} {...props} />

                { hasChild && <Page page={page + 1} ref={nextPageRef} {...props} /> }
            </>
        )
    })

    return Page
}

export default makePagination