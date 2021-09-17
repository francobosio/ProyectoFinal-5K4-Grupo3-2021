import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper} from '@material-ui/core';
import AppBar from '../AppBar/AppBar.js';
import Footy from '../Footy/Footy.jsx';
import ListaImagenes from '../ListaImagenes/ListaImagenes.jsx';
import Image from 'material-ui-image';
import {MiDrawer} from "../Drawer/Drawer.jsx"

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        'background': '#99cfbf',
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    icono: {
        marginLeft: -3,
    },
    toolbar: {
        // display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    carousel: {
        marginTop: 11,
        marginHorizon: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    link: {
        color: "white",
        "text-decoration": "none",
    },
    content: {
        'background': '#99cfbf',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    slider:{
        marginTop:500,
    },
    titulo:{
        marginLeft: 20,
    }
}));

function Item(props) {
    return (
        <Paper>
            <Image src={props.item.imagen} style={{ width: 180, height: 100, justifyContent: 'center', alignItems: 'center' }} />
        </Paper>
    )
}
export default function MiniDrawer() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MiDrawer/>
            <main className={classes.content}>
                <AppBar />
                <ListaImagenes/>
                <Footy/>
            </main>
        </div>
    );
}
