const valoresSelect = document.querySelector('#valoresCambio');
const resultado = document.querySelector('#resultado');
const cantidadCambio = document.querySelector('#cantidadCambio');
const botonBuscar = document.querySelector('#botonBuscar');
const myChart = document.querySelector('#myChart');
const baseUrl = 'https://mindicador.cl/api';
let chart = null;

async function getValores() {
 let data = null;
    try {
        const res = await fetch(baseUrl);
         data = await res.json();
        return data;
    } catch (error) {
        console.error('Request failed', error);
        
    }
}

async function renderValores() {
    const valores = await getValores();
    let template = "";

    for (const valor in valores) {
        console.log('valor', valores[valor]);
        if(valores.hasOwnProperty(valor) && typeof valores[valor] === 'object') {
            template += `<option value="${valores[valor].codigo}">${valores[valor].nombre}</option>`;
        }
    };

    valoresSelect.innerHTML = template;
}

renderValores();

async function calculandoCambio(event) { 
    const valoresDeCambio = await getValores();

    const valorSeleccionado = valoresSelect.value;
    const cantidad = parseFloat(cantidadCambio.value);

    if(valorSeleccionado in valoresDeCambio) {
        const valorAEvaluar = (valoresDeCambio[valorSeleccionado].valor);
        console.log('valorAEvaluar', valorAEvaluar);
        const cambio = (cantidad / valorAEvaluar).toFixed(2);

        resultado.innerHTML = `<p class="text-light display-6">Resultado: $ ${cambio}</p>`;
        renderizarGrafico()
    }
}

botonBuscar.addEventListener('click', calculandoCambio);

//mostrar el grafico de los ultimos 10 dias
async function renderizarGrafico(){
    const valorSeleccionadoConvertir = valoresSelect.value; 
    const datos = await fetch(`https://mindicador.cl/api/${valorSeleccionadoConvertir.toLowerCase()}`)
    const datas = await datos.json();
      /* realizando data para graficacion */
      const labels = datas.serie.slice(0,10).map((item) => {return item.fecha.substring(0,10)});
    // console.log('labels', labels);
      const valores = datas.serie.slice(0,10).map((item) => {return item.valor});
      //console.log(valores);
      const config = {
          type: 'line',
          data: {
          labels: labels,
          datasets: [
              {
                  label: 'Historial últimos 10 días',
                  backgroundColor: 'grey',
                  data: valores
                  }]}
      };
  
        const chartDOM = document.getElementById("myChart");
        if (chart) {
            chart.destroy();
        }
        chartDOM.style.backgroundColor = 'white';
        chart = new Chart(chartDOM, config);
        chartDOM.innerHTML = chart;
}
