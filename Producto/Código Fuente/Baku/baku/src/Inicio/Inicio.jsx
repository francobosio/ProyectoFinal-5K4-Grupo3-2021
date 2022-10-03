import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import { Typography } from '@material-ui/core';
import AppBar from '../AppBar/AppBar.js';
import Footy from '../Footy/Footy.jsx';
import Slider from '../CarouselPrincipal';
import { Container, Box } from '@mui/system';
import SliderRanked from '../CarouselPrincipalRanked';
import { useAuth0 } from '@auth0/auth0-react'
import Skeleton from '@mui/material/Skeleton';
import  Carrucel from '../Carrusel/Carrucel.jsx';
import { MiDrawer } from "../Drawer/Drawer.jsx";
import * as libroService from '../Libros/LibroService'
import * as usuarioService from '../Sesión/Usuarios/UsuarioService'
import imgCarrusel1 from '../Imagenes/CarruselBaku1.png'
import imgCarrusel2 from '../Imagenes/CarruselBaku2.png'


const useStyles = makeStyles((theme) => ({
    root: {
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
    carousel: {
        paddingTop: "1.5em",
        marginTop: "0.8em",
        alignSelf: 'center',
    },
    slider: {
    },
    titulo: {
        marginLeft: 20,
        'font-weight': 'bold',
        'color': '#000',
        [theme.breakpoints.down('sm')]: {
            fontSize: "1rem",
            marginLeft: 10
            }
    },
    link: {
        color: "white",
        "text-decoration": "none",
    }
}));

export default function Inicio() {
    const [libros, setlibros] = useState([])
    const [librosGenero, setLibrosGenero] = useState([])
    const [librosFavoritos, setLibrosFavoritos] = useState([])
    const [flagScroll, setFlagScroll] = useState(true)
    const [librosRankeados, setlibrosRankeados] = useState([])
    const [flagActualizar, setFlagActualizar] = useState(true)
    const [numeroRandom, setNumeroRandom] = useState(Math.random())
    /* Carga todos los libros desde la base de datos y los guarda en la variable libros como un array */
    const loadLibros = async () => {
        const res = await libroService.getLibrosPublicado();
        const res2 = await libroService.obtenerRanking();
        setlibros(res.data);
        setlibrosRankeados(res2.data);
        console.log(res.data)
        console.log(res2.data)
    }
    useEffect(() => {
        loadLibros()
        window.scrollTo(0, 0)
    }, [])

    const loadUsuario = async () => {
        const res = await usuarioService.getUsuario(user.sub);
        let usuario = res.data;

        if (usuario === null || usuario === undefined) {
            const usuarioData = {
                'auth0_id': user.sub,
                'apellido': user.family_name ? user.family_name : user.nickname,
                'nombre': user.given_name ? user.given_name : user.nickname,
                'tipo': '1',
                'avatar': user.picture,
                'usuario': user.nickname ? user.nickname : 'Invitado' + Math.floor(Math.random() * 100),
                'correo_electronico': user.email
            }
            const res = await usuarioService.createUsuario(usuarioData)
            usuario = res.data.usuario
        }
        localStorage.setItem('usuario_estado', usuario.estado)
        localStorage.setItem("usuario_activo", usuario.auth0_id)
        localStorage.setItem("usuario_id", usuario._id)
        localStorage.setItem("tipoUsuario", usuario.tipoUsuario)
        localStorage.setItem("usuario", usuario.usuario)
        localStorage.setItem("avatar", usuario.avatar)
        //Para favoritos
        const favoritos = await usuarioService.obtenerFavoritos(usuario.auth0_id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos))
        //----------------------------------------------------------------------------------------------
        if (usuario.estado === 'Inactivo') {
            //no mostrar el componente de inicio 
            window.alert("Su cuenta se encuentra inactiva, consulte con el administrador")
            window.location.href = "/";
        }
    }
    useEffect(() => {
        loadUsuario()
    }, [])

    window.onscroll = async function () {
        var y = window.scrollY;
        if (y > 900 && flagScroll === true) {
            setFlagScroll(false);
            console.log("Se disparo el scroll")
            const res2 = await libroService.buscarLibroGenero("Terror");
            const res3 = await libroService.obtenerLibrosFavoritos();
            setLibrosGenero(res2.data);
            setLibrosFavoritos(res3.data);
        };
    }

    const { user } = useAuth0();
    const classes = useStyles();

    return (
        <Grid container direction="row" className={classes.root}>
            <Grid item container direction="column" xs={1} sm={1} md={2} spacing={0}>
                {/* si la pantalla es pequeña achicar el drawer  */}
                <MiDrawer pestaña={1}  />
            </Grid>
            <Grid item container direction="column"  xs={11} sm={11} md={10} spacing={0}>
                <Grid item >
                    <AppBar />
                </Grid>
                <Grid item container alignItems="center" justifyContent="center" className={classes.carousel} >
                    <Carrucel /> 
                </Grid>
                <Grid item component={'main'} >
                        <Typography variant='h4' className={classes.titulo} >Subidos recientemente</Typography>
                        {libros.length > 0 ? (
                            <Slider >
                                {libros.map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                )).reverse()}
                            </Slider>) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo} >Populares en Baku</Typography>
                        {libros.length > 0 ? (
                            //ordenar por cantidad de visitas 
                            <Slider className={classes.slider}>
                                {libros.sort((a, b) => b.visitas - a.visitas).map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                ))}
                            </Slider>) :
                            (<Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo} >Tendencias</Typography>
                        {libros.length > 0 && flagActualizar === true ? (
                            <Slider className={classes.slider}>
                                {libros.sort((a, b) => b.visitas24Horas - a.visitas24Horas).map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                )).sort(() => numeroRandom - 0.5)}
                            </Slider>
                        ) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo} >Ranking</Typography>
                        {librosRankeados.length > 0 ? (
                            <SliderRanked className={classes.slider}>
                                {librosRankeados.map(movie => (
                                    <SliderRanked.Item movie={movie} key={movie._id}></SliderRanked.Item>
                                )).reverse()}
                            </SliderRanked>
                        ) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo}>Elegidos por los editores</Typography>
                        {libros.length > 0 ? (
                            <Slider className={classes.slider}>
                                {libros.map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                )).sort(() => numeroRandom - 0.5)}
                            </Slider>) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo}>Para una noche de terror</Typography>
                        {librosGenero.length > 0 ? (
                            <Slider className={classes.slider}>
                                {librosGenero.map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                )).sort(() => Math.random() - 0.5)}
                            </Slider>) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                        <Typography variant='h4' className={classes.titulo}>Más favoritos por la comunidad</Typography>
                        {librosFavoritos.length > 0 ? (
                            <Slider className={classes.slider}>
                                {librosFavoritos.map(movie => (
                                    <Slider.Item movie={movie} key={movie._id}></Slider.Item>
                                )).sort(() => Math.random() - 0.5)}
                            </Slider>) : (
                            <Skeleton variant="rectangular" sx={{ bgcolor: '#76bfa9' }} width={'86.5vw'} height={'30vh'} />)
                        }
                </Grid>
                <Grid item >
                    <Footy />
                </Grid>
            </Grid>
        </Grid>
    );
}
