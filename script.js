//espera al dom 
document.addEventListener('DOMContentLoaded', () => {
  
  //guardamos todos los elementos 
  const formularioGasto = document.getElementById('formulario-gasto');
  const descripcionInput = document.getElementById('descripcion');
  const montoInput = document.getElementById('monto');
  const fechaInput = document.getElementById('fecha');
  const categoriaInput = document.getElementById('categoria');

  const filtroCategoria = document.getElementById('filtro-categoria');
  const filtroInicio = document.getElementById('filtro-inicio');
  const filtroFin = document.getElementById('filtro-fin');
  const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
  const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');

  const listaGastos = document.getElementById('lista-gastos');
  const totalSpan = document.getElementById('total');
  const btnExportarCsv = document.getElementById('btn-exportar-csv');

  const ctx = document.getElementById('grafico-gastos').getContext('2d');

  // array vacio para guardar los gastos
  let gastos = [];
let grafico = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Comida', 'Entretenimiento', 'Transporte', 'Hogar', 'Otros'],
    datasets: [{
      label: 'Gastos por categoría',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        '#f87171',
        '#60a5fa',
        '#34d399',
        '#fbbf24',
        '#a78bfa'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Gráfico de gastos por categoría'
      }
    }
  }
});

//funcion que muestra los datos
function mostrarGastos(lista) {
  listaGastos.innerHTML = ''; // Limpiar lista

  let total = 0;
  lista.forEach((gasto, index) => {
    total += gasto.monto;

    const li = document.createElement('li');
    li.textContent = `${gasto.fecha} - ${gasto.categoria} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}`;

    // Botón para eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => {
      gastos.splice(index, 1); 
      mostrarGastos(gastos);
      actualizarGrafico(gastos);
    });

    li.appendChild(btnEliminar);
    listaGastos.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2); // Muestra el total
}
//cuando se envia el formulario se valida que todo este completo 
formularioGasto.addEventListener('submit', e => {
  e.preventDefault(); // Evita que recargue la página

  const descripcion = descripcionInput.value.trim();
  const monto = parseFloat(montoInput.value);
  const fecha = fechaInput.value;
  const categoria = categoriaInput.value;

  if (!descripcion || isNaN(monto) || !fecha || !categoria) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  gastos.push({ descripcion, monto, fecha, categoria }); // Guardamos gasto

  formularioGasto.reset();
  mostrarGastos(gastos);
  actualizarGrafico(gastos);
});

//filtrar los gastos por categorias
btnAplicarFiltros.addEventListener('click', () => {
  let gastosFiltrados = gastos;

  const categoria = filtroCategoria.value;
  const inicio = filtroInicio.value;
  const fin = filtroFin.value;

  if (categoria) {
    gastosFiltrados = gastosFiltrados.filter(g => g.categoria === categoria);
  }

  if (inicio) {
    gastosFiltrados = gastosFiltrados.filter(g => g.fecha >= inicio);
  }

  if (fin) {
    gastosFiltrados = gastosFiltrados.filter(g => g.fecha <= fin);
  }

  mostrarGastos(gastosFiltrados);
  actualizarGrafico(gastosFiltrados);
});
//limpiar los filtros
btnLimpiarFiltros.addEventListener('click', () => {
  filtroCategoria.value = '';
  filtroInicio.value = '';
  filtroFin.value = '';
  mostrarGastos(gastos);
  actualizarGrafico(gastos);
});

//exportar los gastos a un archivo 
btnExportarCsv.addEventListener('click', () => {
  if (gastos.length === 0) {
    alert('No hay gastos para exportar.');
    return;
  }

  let csv = 'Fecha,Categoría,Descripción,Monto\n';
  gastos.forEach(gasto => {
    csv += `${gasto.fecha},${gasto.categoria},${gasto.descripcion},${"$",gasto.monto}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'gastos.csv';
  a.click();
  URL.revokeObjectURL(url);
});

//actualizar el grafico 
function actualizarGrafico(lista) {
  const categorias = ['comida', 'entretenimiento', 'transporte', 'hogar', 'otros'];
  const datosPorCategoria = categorias.map(cat => {
    return lista
      .filter(g => g.categoria === cat)
      .reduce((acc, cur) => acc + cur.monto, 0);
  });

  grafico.data.labels = categorias.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));
  grafico.data.datasets[0].data = datosPorCategoria;
  grafico.update();
}




});