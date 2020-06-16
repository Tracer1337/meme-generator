import { useContext, useEffect, useRef } from "react"

import { AppContext } from "../App.js"
import { MAX_SNAPSHOTS } from "../config/constants.js"

function useSnapshots({ createSnapshot, applySnapshot, onSnapshotsEmpty }) {
    const context = useContext(AppContext)

    const snapshots = useRef([])

    const addSnapshot = () => {
        // Create new snapshot
        const newSnapshot = createSnapshot()
        snapshots.current.push(newSnapshot)

        // Apply size constraint
        if (snapshots.current.length > MAX_SNAPSHOTS) {
            snapshots.current.shift()
        }
    }

    const handleUndo = () => {
        // No snapshots left
        if (snapshots.current.length === 0) {
            onSnapshotsEmpty()
            return
        }

        // Apply snapshot
        const snapshot = snapshots.current.pop()
        applySnapshot(snapshot)
    }

    useEffect(() => {
        context.event.addEventListener("undo", handleUndo)

        return () => {
            context.event.removeEventListener("undo", handleUndo)
        }
    })

    return addSnapshot
}

export default useSnapshots