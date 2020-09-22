import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { AppBar, Toolbar, IconButton, Grid, Divider } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import HomeIconOutlined from "@material-ui/icons/HomeOutlined"
import HomeIconFilled from "@material-ui/icons/Home"
import AccountIconOutlined from "@material-ui/icons/AccountCircleOutlined"
import AccountIconFilled from "@material-ui/icons/AccountCircle"
import AddIcon from "@material-ui/icons/AddCircleOutline"

const useStyles = makeStyles(theme => ({
    footer: {
        backgroundColor: theme.palette.background.default,
        position: "fixed",
        top: "auto",
        bottom: 0,
        boxShadow: "none"
    }
}))

function FooterItem({ path, iconActive, iconInactive }) {
    const history = useHistory()

    const location = useLocation()

    const isActive = location.pathname.startsWith(path)

    return (
        <IconButton onClick={() => history.push(path)}>
            {isActive ? iconActive : iconInactive}
        </IconButton>
    )
}

function Footer() {
    const classes = useStyles()

    return (
        <AppBar className={classes.footer}>
            <Divider/>

            <Toolbar>
                <Grid container justify="space-around">
                    <FooterItem path="/feed" iconActive={<HomeIconFilled/>} iconInactive={<HomeIconOutlined/>}/>
                    <FooterItem path="/editor" iconActive={<AddIcon />} iconInactive={<AddIcon/>}/>
                    <FooterItem path="/profile" iconActive={<AccountIconFilled/>} iconInactive={<AccountIconOutlined/>}/>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Footer