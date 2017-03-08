$(document).ready(function(){
  var tour = new Tour({
  storage: false,
  
  steps: [
  {
    element: "#sidebar-toggler",
    title: "Minimizar menú lateral",
    content: "Botón para minimizar el menú lateral.",
    autoscroll: false
  },
    {
    element: ".refresh-programador",
    title: "Actualizar página",
    content: "La página se actualiza automáticamente cada cierto intervalo de tiempo. Se puede refrescar de manera manual en este botón.",
    autoscroll: false
  },
    {
    element: ".home-programador",
    title: "Ir al menú principal",
    content: "Botón para ir al menú principal. Desde este menú se pueden acceder a las pantallas de verificación, almacén y montaje.",
    autoscroll: false
  },
    {
    element: ".ayudaprogramador",
    title: "Manual de ayuda",
    content: "Botón para abrir el documento de ayuda de la aplicación en PDF."
  },
    {
    element: ".seleccion-motor",
    title: "Selección tipos de motor",
    content: "Los tipos de motor se seleccionan <strong>de manera automática</strong> al introducir el serial number del módulo (no es necesario seleccionar ninguno). Solamente será necesario seleccionar un tipo de motor si la aplicación no reconoce el serial number que se introduce en el campo más abajo.",
    autoscroll: false
  },
    {
    element: ".opciones",
    title: "Añadir etapa",
    content: "En estos campos se introduce la etapa del juego a añadir, bien de forma individual o bien marcando la casilla \"Añadir todas las etapas\". Al marcar esta última, se introducirán todas las etapas para el serial number que se quiera (4, 5 o 6 etapas dependiendo del tipo de motor, esto lo selecciona la aplicación de forma automática). Si alguna de las etapas ya estuviese añadida, no se añadirá.",
    autoscroll: false
  },
    {
    element: "#nameplate-programador",
    title: "Serial Number del módulo",
    content: "En este campo se introduce el serial number del módulo cuyo juego de álabes/disco se quieren añadir. La aplicación corrige de forma automática el serial si se introduce mal.",
    autoscroll: false
  },
    {
    element: ".botones-form-programador",
    title: "Botones de acción",
    content: "Para añadir el juego(s) deseado(s), basta pulsar el botón OK. Si el juego ya se hubiese añadido, un mensaje en la parte superior derecha de la pantalla nos lo avisará y no se añadirá. Si no se hubiese añadido con anterioridad, se añadirá correctamente y un mensaje en la parte superior derecha de la pantalla nos lo indicará. Mediante el botón CANCELAR, se limpia el formulario para comenzar de nuevo.",
    autoscroll: false
  },
      {
    element: ".subir-faltantes:first",
    title: "Subir archivo excel de faltantes",
    content: "Este formulario nos permite seleccionar el archivo excel (archivos *.xls o *.xlsx) de faltantes y subirlo para que la aplicación ponga automáticamente como faltantes las piezas (icono <i class=\"fa fa-exclamation-circle\"></i>).<br>La aplicación pone todos las piezas como NO FALTANTES para posteriormente leer el archivo, buscar discos y álabes y poner como FALTANTES las que en él se encuentran. Todas las piezas que no se encuentren en el archivo, se considerarán como NO FALTANTES.<br><br> <strong>NOTA IMPORTANTE:</strong> el archivo de faltantes de T700, al ser diferente al resto de motores, debe contener en su nombre la cadena de caracteres \"T700\", da igual donde se encuentre (se puede encontrar en medio de otros caracteres) o si es en mayúsculas o minúsculas. Ejemplos válidos: faltantest700.xls, T700_faltantes.xls, 190102_faltantest700_almacen.xls...<br>El archivo que se suba para el resto de motores, puede contener cualquier nombre pero NO la cadena \"T700\" anteriormente explicada. Esto es así para que la aplicación pueda distinguir si el archivo que se sube es para T700 o para el resto.<br>Por seguridad, la aplicación no permite subir archivos que no sean .xls o .xlsx",
    placement: "top",
    autoscroll: false
  },
        {
    element: ".fechas",
    title: "Ultimas actualizaciones faltantes",
    content: "Se indican las fechas en las que se subieron archivos excel de faltantes por última vez. Así se puede llevar un control actualizado.",
    placement: "right",
    autoscroll: false
  },
    {
    element: ".titulo-no-suministrados",
    placement: "bottom",
    title: "Juegos de álabes y discos",
    content: "En esta parte de la pantalla se muestran los juegos de álabes y discos de forma similar al panel de imanes del taller. Cuando uno de los juegos se ha suministrado a la zona de suministro por parte de almacén, un icono verde circular con una carretilla aparece en la pieza corresponidente. Si ambas piezas (tanto disco como álabes) se han suministrado por parte de almacén para un serial number, el juego desaparece de esta lista y se añade más abajo (zona de juegos suministrados)."
  },
      {
    element: ".suministrado:first",
    placement: "bottom",
    title: "Icono suministrado <img src=\"img/suministrado.png\">",
    content: "Este icono indica que almacén ya ha suministrado esta pieza (la ha dejado en la zona de acumulación para montaje correspondiente)."
  },
        {
    element: ".fa-hand-stop-o:first",
    placement: "top",
    title: "Icono pieza no suministrable <i class=\"fa fa-hand-stop-o\"></i>",
    content: "Este icono <i class=\"fa fa-hand-stop-o\"></i> indica que la línea de producción ha decidido poner esta pieza como no suministrable (por razones técnicas, de logística, etc..). Pulsando sobre él, podemos volver a poner la pieza como disponible."
  },
          {
    element: ".fa-exclamation-circle:first",
    placement: "top",
    title: "Icono pieza sin stock <i class=\"fa fa-exclamation-circle\"></i>",
    content: "Este icono <i class=\"fa fa-exclamation-circle\"></i> indica que la pieza no está disponible por faltante. Pulsando sobre él, podemos poner de nuevo la pieza en stock."
  },
        {
    element: ".eliminar-programa:first",
    placement: "bottom",
    title: "Eliminar juego <button class=\"btn btn-xs btn-danger\"><i class=\"fa fa-trash\"></i></button>",
    content: "Este icono se utiliza para eliminar el juego de álabes/disco correspondiente."
  },
        {
    element: ".alabe:first",
    placement: "right",
    title: "Etiqueta de pieza",
    content: "Esta etiqueta simula los imanes del panel de montaje. Pulsando sobre cualquiera de ellas, nos saldrá un cuadro de diálogo que nos permite ponerla como <strong>sin stock</strong> o como <strong>no suministrable</strong> por causas de la producción. Para variar su orden, basta mantener presionado el botón izquierdo del ratón y arrastrar <i class=\"fa fa-arrow-down\" aria-hidden=\"true\"></i><i class=\"fa fa-arrow-up\" aria-hidden=\"true\"></i> las etiquetas hasta la posición deseada."
  },
      {
    element: ".titulo-suministrados",
    placement: "bottom",
    title: "Juegos de álabes y discos suministrados",
    content: "En esta parte de la pantalla se muestran los últimos juegos que han sido suministrados por almacén a las zonas de suministro correspondientes (tanto álabes como disco se han suministrado)."
  }
]});

$('.iniciar-tour').on('click', function(){
  localStorage.clear();
  tour.init();
  tour.restart(); 
});


});
