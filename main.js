const IVA = 0.16
let nombre
let monto, 
plazo, 
totalPagos, 
tasaAnual, 
fechaInicio,
fechaPago,
tasaMensual,
mensualidad, 
intereses, 
impuestos,
capital,
insoluto,
primerInteres,
primerImpuesto, 
primerCapital, 
primerInsoluto, 
primerFechaPago,
acumIntereses, 
acumImpuestos,
acumCapital

const dinero = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARG'
})

let establecerDatos = function () {
  primerInteres = 0, primerImpuesto = 0, primerCapital = 0, primerInsoluto = 0, primerFechaPago = true
  acumIntereses = 0, acumImpuestos = 0, acumCapital = 0


 


// DOM
  nombre = document.getElementById('nombre').value  
  monto = document.getElementById('monto').value  
  periodo = document.getElementById('periodo').value
  plazo = document.getElementById('plazo').value
  tasaAnual = document.getElementById('interes').value

  fechaInicio = new Date(document.getElementById('fecha').value)
  fechaInicio.setDate(fechaInicio.getDate() + 1) 

  let plazoMensual = document.getElementById('mensual').checked
  let plazoAnual = document.getElementById('anual').checked

  

  if ( plazoMensual === true ) {
    this.plazo = plazo
  } else if ( plazoAnual === true ) {
    this.plazo = plazo * 12
  } else {
    Swal.fire("No seleccionaste ningún tipo de plazo");
    
  }



  switch ( periodo ) {
    case 'semanal':
      let fechaFin = new Date(fechaInicio)
      fechaFin.setMonth(fechaFin.getMonth() + parseInt(plazo))
      let tiempo = fechaFin.getTime() - fechaInicio.getTime()
      let dias = Math.floor(tiempo / (1000 * 60 * 60 * 24))
      totalPagos = Math.ceil(dias / 7)
      break
    case 'quincenal':
      totalPagos = plazo * 2
      break
    case 'mensual':
      totalPagos = plazo
      break
    default:
      Swal.fire("No seleccionaste ningún periodo de pagos");
      break
  }
}

function calcularTasaMensual () {
  tasaMensual = (tasaAnual / 100) / 12
  return tasaMensual
}

function tasaMensualconIVA () {
  return (calcularTasaMensual() + (calcularTasaMensual() * IVA))
}

function PagoMensual () {
  let denominador = Math.pow((1 + tasaMensualconIVA()), totalPagos) - 1
  mensualidad = (tasaMensualconIVA() + (tasaMensualconIVA() / denominador)) * monto
  return mensualidad
}

function calcularTotalPrestamo () {
  let totalPrestamo = 0
  for ( let i = 0; i < totalPagos; i++ ) {
    totalPrestamo += mensualidad
  }
  return totalPrestamo
}

function obtenerPagoMensual () {
  return Math.round(PagoMensual(), 2)
}

function obtenerTotalPrestamo () {
  return Math.round(calcularTotalPrestamo(), 2)
}

function Intereses () {
  if ( primerInteres === 0 ) {
    intereses = tasaMensual * monto
    primerInteres = intereses
  } else {
    intereses = tasaMensual * insoluto
  }
  return intereses
}

function Impuestos () {
  if ( primerImpuesto === 0 ) {
    impuestos = primerInteres * IVA
    primerImpuesto = impuestos
  } else {
    impuestos = Intereses() * IVA
  }
  return impuestos
}

function Capital () {
  if ( primerCapital === 0 ) {
    capital = mensualidad - primerInteres - primerImpuesto
    primerCapital = capital
  } else {
    capital = mensualidad - Intereses() - Impuestos()
  }
  return capital
}

function SaldoInsoluto () {
  if ( primerInsoluto === 0 ) {
    insoluto = monto - primerCapital
    primerInsoluto = insoluto
  } else {
    insoluto -= Capital()
  }
  return insoluto
}
// evento
function simularPrestamo () {
  establecerDatos()
  PagoMensual()
  calcularTotalPrestamo()
//array
  let columnas = [ 'Meses', 'Mensualidad', 'Intereses', 'Impuestos', 'Capital', 'Insoluto' ]
// DOM
  let amortizaciones = document.getElementById('amortizaciones')
  let tabla = document.createElement('table')
  let cabeceraTabla = document.createElement('thead')
  let cuerpoTabla = document.createElement('tbody')
  let pieTabla = document.createElement('tfoot')
  let fila = document.createElement('tr')

  // inicio tabla
  for ( let j = 0; j < columnas.length; j++ ) {
    let celda = document.createElement('td')
    let texto = columnas[j]
    let textoCelda = document.createTextNode(texto)
    celda.appendChild(textoCelda)
    fila.appendChild(celda)
  }
  cabeceraTabla.appendChild(fila)

  // relleno tabla
  for ( let i = 0; i < totalPagos; i++ ) {
    let intereses = Intereses(), impuestos = Impuestos(), capital = Capital(), insoluto = SaldoInsoluto()
    acumIntereses += intereses
    acumImpuestos += impuestos
    acumCapital += capital

    let fila = document.createElement('tr')
    for ( let j = 0; j < columnas.length; j++ ) {
      let celda = document.createElement('td')
      let texto

      switch ( columnas[j] ) {
        case 'Meses':
          texto = (i + 1)
          break       
        case 'Mensualidad':
          texto = dinero.format(mensualidad)
          break
        case 'Intereses':
          texto = dinero.format(intereses)
          break
        case 'Impuestos':
          texto = dinero.format(impuestos)
          break
        case 'Capital':
          texto = dinero.format(capital)
          break
        case 'Insoluto':
          texto = dinero.format(Math.abs(insoluto))
          break
        default:
          texto = null
          break
      }
      let textoCelda = document.createTextNode(texto)
      celda.appendChild(textoCelda)
      fila.appendChild(celda)
    }
    cuerpoTabla.appendChild(fila)
  }

  
  for ( let j = 0; j < columnas.length; j++ ) {
    let celda = document.createElement('td')
    let texto
    switch ( columnas[j] ) {
      case 'Meses':
        texto = totalPagos
        break
      case 'Intereses':
        texto = dinero.format(acumIntereses)
        break
      case 'Impuestos':
        texto = dinero.format(acumImpuestos)
        break
      case 'Capital':
        texto = dinero.format(acumCapital)
        break
      default:
        texto = ''
        break
    } 
    if  (intereses > "1"){
      msg = "Amortizacion de " + nombre;
     } else {
      msg = " " ;
     }
     let div2 = document.getElementById("apodo");
   div2.innerHTML = msg;
    
    
    // DOM

    let textoCelda = document.createTextNode(texto)
    celda.appendChild(textoCelda)
    pieTabla.appendChild(celda)
  }
  
  
  tabla.appendChild(cabeceraTabla)
  tabla.appendChild(cuerpoTabla)
  tabla.appendChild(pieTabla)
  amortizaciones.appendChild(tabla)

  
}
/// envio consulta via email
const btn = document.getElementById('button');

  document.getElementById('form')
   .addEventListener('submit', function(event) {
     event.preventDefault();
  
     btn.value = 'Enviando...';
  
     const serviceID = 'default_service';
     const templateID = 'template_5ypxm2g';
  
     emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.value = 'Mensaje Enviado';
        alert('Enviado');
      }, (err) => {
        btn.value = 'Mensaje Enviado';
        alert(JSON.stringify(err));
      });
  });