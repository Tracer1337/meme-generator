import React, { useState } from "react"
import { Tabs, Tab, Divider } from "@material-ui/core"
import SwipeableViews from "react-swipeable-views"
import { makeStyles } from "@material-ui/core/styles"
import TemplatesIcon from "@material-ui/icons/CloudDownload"
import PostsIcon from "@material-ui/icons/GridOn"

import Templates from "./Templates.js"
import PostsGrid from "./PostsGrid.js"

const useStyles = makeStyles(theme => ({
    profileContent: {
        marginTop: theme.spacing(2)
    },

    tabsWrapper: {
        marginBottom: theme.spacing(2)
    }
}))

function ProfileContent({ user, onReload }) {
    const classes = useStyles()

    const [currentTab, setCurrentTab] = useState(0)
    
    return (
        <div className={classes.profileContent}>

            <div className={classes.tabsWrapper}>
                <Divider/>

                <Tabs
                    value={currentTab}
                    onChange={(_, tab) => setCurrentTab(tab)}
                    variant="fullWidth"
                >
                    <Tab icon={<TemplatesIcon/>}/>
                    <Tab icon={<PostsIcon/>}/>
                </Tabs>

                <Divider/>
            </div>

            <SwipeableViews
                index={currentTab}
                onChangeIndex={setCurrentTab}
                axis="x"
                disableLazyLoading
            >
                <Templates
                    templates={user.templates}
                    renderUserTemplates={false}
                    onReload={onReload}
                />

                <PostsGrid user={user}/>
            </SwipeableViews>
        </div>
    )
}

export default ProfileContent