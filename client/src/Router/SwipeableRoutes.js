import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import SwipableViews from "react-swipeable-views"

function SwipeableRoutes({ children }) {
    const routes = children.map(child => {
        if (!child.props.path) {
            throw new Error(`Missing path for '${child.type.name}'`)
        }

        return child.props.path
    })

    const findRouteIndex = route => routes.findIndex(path => route.startsWith(path))

    const location = useLocation()

    const [currentIndex, setCurrentIndex] = useState()

    const handleChangeIndex = index => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        const newIndex = findRouteIndex(location.pathname)

        if (newIndex !== -1) {
            setCurrentIndex(newIndex)
        }

        // eslint-disable-next-line
    }, [location])

    return (
        <SwipableViews index={currentIndex} onChangeIndex={handleChangeIndex} disabled animateHeight>
            {React.Children.map(children, (child, i) => (
                React.cloneElement(child, {
                    isActive: i === currentIndex
                })
            ))}
        </SwipableViews>
    )
}

export default SwipeableRoutes