import React, { useEffect, useState, Component } from "react";
import ReactApexChart from "react-apexcharts";
import * as usuarioService from '../Sesión/Usuarios/UsuarioService'

const ColumnChart = (props) => {

        const [usuarios, setUsuarios] = useState([])
        const loadUsuarios = async () => {
            const res = await usuarioService.getLibrosLeidosPorUsuario();
            setUsuarios(res.data);
        }

        //El codigo del useEffect se renderiza despues de que se haya montado el componente
        useEffect(() => {
            loadUsuarios()
            //window.scrollTo(0, 0)
        }, [props.fechaDesde, props.fechaHasta])

        //Con esto renderizamos el gráfico después de que se hayan seteado los libros del Backend en la variable de estado
        var isVisible = false
        if(usuarios.length != 0){
            isVisible = true
        }

        usuarios.forEach(usuario => {
            let libros_leidos = usuario.libros_leidos.filter(libro_leido => new Date(libro_leido.creado) >= props.fechaDesde && new Date(libro_leido.creado) <= props.fechaHasta );
            usuario.libros_leidos = libros_leidos
        })

        var librosLeidos_UltimaPag = []
        usuarios.forEach(usuario => {
            librosLeidos_UltimaPag = librosLeidos_UltimaPag.concat(usuario.libros_leidos)
        })
    
        var todosLibrosLeidos = []
        librosLeidos_UltimaPag.forEach(libroLeido => {
            todosLibrosLeidos = todosLibrosLeidos.concat(libroLeido.id_libro)
        })

        var idLibrosLeidos = []
        todosLibrosLeidos.forEach(libroLeido => {
            idLibrosLeidos = idLibrosLeidos.concat(libroLeido._id)
        })
    
        const map = new Map(todosLibrosLeidos.map(pos => [pos._id, pos]));
        const uniqueLibrosLeidos = [...map.values()];
    
        let librosLeidos = [];
        uniqueLibrosLeidos.forEach(function (elemento, indice, array) {
            const libroLeidoCount = {
              name: elemento.titulo,
              value: idLibrosLeidos.countCertainElements(elemento._id) //For Each para contar 
            };
            librosLeidos.push(libroLeidoCount);
        });
    
        librosLeidos.sort(function (a, b) {
            if (a.value < b.value) {
              return 1;
            }
            if (a.value > b.value) {
              return -1;
            }
            // a debe ser igual a b
            return 0;
          });
        //LOS 10 LIBROS MAS LEIDOS
        const librosLeidos10 = librosLeidos.slice(0, 10)
        
        let librosCategorias = [];
        let librosData = [];
        librosLeidos10.forEach(function (elemento, indice, array) {
            librosCategorias.push(elemento.name);
            librosData.push(elemento.value);
        });

        //Con esto renderizamos el gráfico después de que se hayan seteado los libros del Backend en la variable de estado
        let isVisible = false
        let avisoVisible = false
        if(usuarios.length !== 0){
            isVisible = true
            if (existenciaDatos === 0) {
                isVisible = false
                avisoVisible = true
            } 
        }

        var seriesLibros = [
            {
                name: 'Cantidad de Lecturas',
                data: librosData
            }
        ];
        
        //OPCIONES DEL GRÁFICO

        const colors = ["#FFC300","#FF5733","#C70039","#900C3F","#581845","#3D3D6B","#2A7B9B","#00BAAD","#57C785","#ADD45C","#ADD45C"]
    
        var options= {
            chart: {
                type: 'bar',
                stacked: true,
                toolbar: { //Zoom, mover y descargar
                    show: true
                },
            },
            // annotations: {
            //     yaxis: [{
            //         y: 4,
            //         width: '523',
            //         strokeDashArray: 0, //crea guiones - - - - - - - - 
            //         borderColor: '#775DD0',
            //         label: {
            //                 borderColor: '#775DD0',
            //                 style: {
            //                     color: '#fff',
            //                     background: '#775DD0',
            //                 },
            //                 text: 'Promedio',
            //         }
            //     }],
            // },
            colors: colors,
            
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: '50%',
                    distributed: true,  //Distribuye los colores
                    barHeight: '75%',
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                }
            },
            dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            legend: {
                show: false
            },
            stroke: {
                width: 2
            },
            grid: {
                row: {
                colors: ['#fff', '#f2f2f2']
                }
            },
            xaxis: {
                title: {
                    text: 'LIBROS',
                    offsetY: -35,
                },
                labels: {
                    show: true,
                    rotate: -65,
                    rotateAlways: true,
                    minHeight: 200,
                    maxHeight: 230,
                    hideOverlappingLabels: false, //No ocultar las etiquetas superpuestas
                    trim: true, //Corta los nombres muy largos en los labels y lo completa con puntos suspensivos ...
                    style: {
                        fontSize: '14px',
                    }
                },
                
                categories: librosCategorias,
                tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'LECTURAS',
                },
                labels: {
                    show: true,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
                },
            }
        }

        return (
            <div id="Bar">
                {isVisible && (
                    <ReactApexChart options={options} series={seriesLibros} type="bar" height={550} width={600}/>
                )}
            </div>
        );
}
export default ColumnChart;