import React, { useState, useContext, useRef, useEffect, useImperativeHandle } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { IconButton, GridList, GridListTile, GridListTileBar, Typography, Divider } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"

import { AppContext } from "../../../App.js"
import SearchBar from "./SearchBar.js"
import { deleteTemplate } from "../../../config/api.js"
import { VISIBILITY } from "../../../config/constants.js"
import { cacheImage } from "../../../utils/cache.js"
import makePagination from "../../../utils/makePagination.js"
import { createListeners } from "../../../utils"

const useStyles = makeStyles(theme => ({
    spacer: {
        height: theme.spacing(2)
    },
    
    listWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden"
    },

    list: {
        maxWidth: 400,
        width: "100%"
    },

    tile: {
        cursor: "pointer"
    },

    tilebar: {
        height: 56
    },

    searchBar: {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
        marginTop: 0
    },

    deleteButton: {
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0
    },

    title: {
        marginBottom: theme.spacing(2)
    },

    divider: {
        margin: `${theme.spacing(2)}px 0`,
        width: `calc(100% - ${theme.spacing(1)}px)`
    }
}))

const getSubtitle = (count) => {
    if (count === 1) {
        return "1 Meme Created"
    } else {
        return count + " Memes Created"
    }
}

function TemplatesGrid({ data, onClick, onDelete, search, user, onLoadNextPage }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const lastElementRef = useRef()

    const handleImageLoad = (template) => {
        cacheImage(template.image_url)
    }

    useEffect(() => {
        const parent = document.getElementById("templates-dialog-inner-container")

        if (!parent || !data.length) {
            return
        }

        let hasScrolledToBottom = false

        const handleScroll = () => {
            if (hasScrolledToBottom) {
                return
            }

            if (parent.scrollTop + parent.offsetHeight >= parent.scrollHeight - 100) {
                onLoadNextPage()
                hasScrolledToBottom = true
            }
        }

        handleScroll()

        return createListeners(parent, [
            ["scroll", handleScroll]
        ])

        // eslint-disable-next-line
    }, [])

    let renderTemplates = data

    if (user) {
        renderTemplates = renderTemplates.filter(template => template.visibility !== VISIBILITY["GLOBAL"])
    }

    // Filter by search string
    renderTemplates = renderTemplates.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase()))

    return (
        <GridList cellHeight={150} className={classes.list}>
            {renderTemplates.map((template, i) => {
                const isLastElement = i === renderTemplates.length - 1
                
                return (
                    <GridListTile key={i} className={classes.tile} onClick={e => onClick(e, template)} ref={isLastElement ? lastElementRef : null}>
                        <img src={template.image_url} alt={template.label} loading="lazy" onLoad={() => handleImageLoad(template)} />

                        <GridListTileBar title={template.label} subtitle={getSubtitle(template.amount_uses)} className={classes.tilebar} />

                        {context.auth.isLoggedIn && (template.user_id === context.auth.user.id || (template.visibility === VISIBILITY["GLOBAL"] && context.auth.user.is_admin)) && (
                            <IconButton onClick={() => onDelete(template)} className={classes.deleteButton}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </GridListTile>
                )
            })}
        </GridList>
    )
}

const GlobalTemplatesRenderer = makePagination("getTemplates", TemplatesGrid)
const UserTemplatesRenderer = makePagination("getTemplatesByUser", TemplatesGrid)

function Templates({ user, onReload }, ref) {
    const context = useContext(AppContext)
    
    const location = useLocation()

    const history = useHistory()

    const classes = useStyles()

    const currentTemplate = useRef({})
    const globalTemplatesRef = useRef()
    const userTemplatesRef = useRef()

    const [search, setSearch] = useState("")

    const handleDelete = (template) => {
        currentTemplate.current = template

        const dialogHandle = context.openDialog("Confirm", { content: `The template "${currentTemplate.current.label}" will be deleted` })

        dialogHandle.addEventListener("close", (shouldDelete) => {
            if (shouldDelete) {
                deleteTemplate(currentTemplate.current.id)
                    .then(onReload || reload)
            }
        })
    }

    const handleLoad = async (template) => {
        if (!location.pathname.startsWith("/editor")) {
            history.push("/editor")
            await new Promise(requestAnimationFrame)
        }
        context.dispatchEvent("resetCanvas")
        context.dispatchEvent("loadTemplate", { template })
    }

    const handleClick = (event, template) => {
        // Prevent loading when delete icon got clicked
        if (event.target.tagName === "DIV" || event.target.tagName === "IMG") {
            handleLoad(template)
        }
    }

    const reload = () => {
        globalTemplatesRef.current.reload()

        if (userTemplatesRef.current) {
            userTemplatesRef.current.reload() 
        }
    }
    
    useImperativeHandle(ref, () => ({ reload }))

    const Renderer = user ? UserTemplatesRenderer : GlobalTemplatesRenderer

    const sharedProps = {
        onClick: handleClick,
        onDelete: handleDelete,
        search
    }

    return (
        <>
            <div className={classes.spacer}/>

            <SearchBar onChange={setSearch} value={search} className={classes.searchBar}/>
            
            <div className={classes.listWrapper}>
                { context.auth.isLoggedIn && !user && (
                    <>
                        <Typography variant="h5" className={classes.title}>My Templates</Typography>
                        <UserTemplatesRenderer
                            ref={userTemplatesRef}
                            user={context.auth.user}
                            apiData={{ userId: context.auth.user.id }}
                            {...sharedProps}
                        />
                        <Divider className={classes.divider} />
                    </>
                ) }

                <Renderer
                    ref={globalTemplatesRef}
                    user={user}
                    apiData={{ userId: user?.id }}
                    {...sharedProps}
                />
            </div>
        </>
    )
}

export default React.forwardRef(Templates)