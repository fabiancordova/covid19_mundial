async function obtener_datos() {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/total`);
        const datos = await respuesta.json();
        const data = datos.data;
        if (data) {
            console.log(data)
            dibujar_grafico(data)
            llenar_tabla(data)
        }
       
    } catch (err) {
        console.error(`Error: ${err}`)
    } 
}

obtener_datos()


function llenar_tabla(datos) {
/*    let rows = ""
     for (let row of  data)  {
        rows += `<tr>
            <td> ${row.location} </td>
            <td> ${row.active} </td> 
            <td> ${row.confirmed} </td> 
            <td> ${row.deaths} </td> 
            <td> ${row.recovered} </td> 
            <td><a id="modal-detalle" class="js-modal-details" country-location='${row.location}' href="#">Ver detalle</a></td> 
        </td>`
    }
    $(`tbody`).append(rows)
 */
   
    for (let dato of  datos)  {
        $(`tbody`).append( 
           `<tr>
            <td> ${dato.location} </td>
            <td> ${dato.active} </td> 
            <td> ${dato.confirmed} </td> 
            <td> ${dato.deaths} </td> 
            <td> ${dato.recovered} </td> 
            <td><a id="modal-detalle" class="js-modal-details" country-location='${dato.location}' href="#">Ver detalle</a></td> 
        </td>
        `)
    }      
}

function filtrar_paises(data) {
    data = data.filter(item => item.confirmed >= 100000)
    return {
        labels: data.map(item => item.location),
        datasets:[
            {
                label: 'Casos activos',
                backgroundColor: 'red',
                data: data.map(item => item.active),
            }, 
            {
                label: 'Casos confirmados',
                backgroundColor: 'yellow',
                data: data.map(item => item.confirmed) 
            }, 
            {
                label: 'Casos muertos',
                backgroundColor: 'gray',
                data: data.map(item => item.deaths) 
            }, 
            {
                label: 'Casos recuperados',
                backgroundColor: 'blue',
                data: data.map(item => item.recovered) 
            } 
        ]
    }
}

function dibujar_grafico(data) {
    const {labels,datasets} = filtrar_paises(data);
    console.log("data g",data);
/*     const grafico = document.querySelector('covidChart')
 */    new Chart(covidChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
    })
}

function mostrar_modal(data) {
    $('#modal_pais').modal('show')
    $('.modal-title').text(data.location)
    const active = data.active
    const confirmed = data.confirmed
    const deaths = data.deaths
    const recovered = data.recovered
    console.log("data", data);
    const modal_grafico = document.querySelector('#modal_grafico')
    new Chart(modal_grafico, {
        type: 'pie',
        data: {
            labels: ['activos','confirmados','muertos','recuperados'],
            datasets: [{
                data: [active,confirmed,deaths,recovered],
                backgroundColor: [
                    'red',
                    'yellow',
                    'gray',
                    'blue',
                ]
            }] 
        },
    })
}


async function obtener_pais(pais) {
    try {
        const response = await fetch(`/api/countries/${pais}`)
        const datos = await response.json()
        const data = datos.data
         mostrar_modal(data)
    } catch (err) {
        console.error(`Error: ${err}`)
    } 
}

$('tbody').on("click", "#modal-detalle" , function(e) {
    e.preventDefault()
    let pais = this.getAttribute('country-location')
    obtener_pais(pais)
});



