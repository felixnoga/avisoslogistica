$(document).ready(function(){
  var tour = new Tour({
  storage: false,
  
  steps: [
  {
    element: ".btn-linea-ip",
    title: "Suministros linea IP",
    content: "Este botón aparece de color rojo cuando alguno de los puestos de la línea de IP necesita suministro (álabes IP, soporte HP/IP, carcasa IP, etc...). El número junto al icono de la campana <i class=\"fa fa-bell\" ></i> indica el número de puestos que necesitan suministro. Aparecerá en verde si ningún puesto requiere suministro.",
    placement: "bottom"
  },
    {
    element: ".btn-integracion",
    title: "Suministros línea montaje LPT",
    content: "Al igual que el anterior, este botón aparece de color rojo cuando alguno de los puestos de la línea de integración requiere una pieza (TBH, carcasa LPT o eje LPT). El número junto al icono de la campana <i class=\"fa fa-bell\" ></i> indica el número de piezas que necesitan suministrarse. Aparecerá en verde si ningún puesto requiere suministro.",
    placement: "bottom"
  },
    {
    element: "#encabezadodiscos",
    title: "Discos para suministro",
    content: "Listado por orden de los discos que necesitan suministro. Los discos de etapas de cúrvico aparecen con un icono azul <img src=\"img/discocurvico.png\">. Pulsando los iconos de carretilla junto a cada disco, se suministra el disco y se elimina de la lista (una vez que el disco se haya llevado a la zona de acumulación para montaje).",
    placement: "top"
  },
      {
    element: ".fa-hand-stop-o:first",
    title: "Pieza no suministrable",
    content: "El icono <i class=\"fa fa-hand-stop-o\"></i> representa que el disco o los álabes no se pueden suministrar debido a que la línea de producción lo ha decidido así (por problemas técnicos, logísticos, etc...). La fila en cuestión aparecerá coloreada de amarillo.",
    placement: "top"
  },
      {
    element: "img[src=\"img/linde.png\"]:first",
    title: "Icono suministrar <img src=\"img/linde.png\">",
    content: "Pulsando el icono <img src=\"img/linde.png\"> suministramos la pieza en cuestión. Una vez se deje la pieza en el área correspondiente, se pulsa sobre este icono y la pieza se considera suministrada y desaparece de la lista. La pieza pasa ahora a estar en el área de acumulación (más abajo), lista para consumo por parte de montaje.",
    placement: "top"
  },
    {
    element: ".ocupadadisco:last",
    title: "Discos en acumulación",
    content: "<img src=\"img/tour_disco.png\"><br>Estos iconos representan los discos que se han suministrado (se ha pulsado el icono de carretilla en el listado superior). Corresponden por tanto a los discos que hay en la zona de acumulación. Cada icono muestra la etapa, el serial number y el color correspondiente de forma automática cuando se suministra un disco por parte de almacén. Según se vayan consumiendo por parte de montaje, irán automáticamente desapareciendo. <strong>NOTA: pulsando sobre uno de los iconos, se elimina automáticamente (desaparece de esta lista) y se considera que el disco ya no está en acumulación.</strong><br><img src=\"img/acudiscos.png\">",
    placement: "right",
  },
      {
    element: ".buffercurvicos",
    title: "Disco etapa cúrvico en acumulación",
    content: "<img src=\"img/tour_curvicos.png\"><br>Este icono rodeado por el recuadro rojo representa el disco etapa de cúrvico que se ha suministrado (se ha pulsado el icono de carretilla en un disco con el icono <img src=\"img/discocurvico.png\"> en el listado superior). Según se consuma por parte de montaje, irá automáticamente desapareciendo. Sólo se permite un disco de cúrvico. <strong>NOTA: pulsando sobre este icono, se elimina automáticamente (desaparece de esta lista) y se considera que el disco ya no está en acumulación.</strong><br><img src=\"img/acudiscos.png\">",
    placement: "right"
  },

    {
    element: "#encabezadoalabes",
    title: "Álabes para suministro",
    content: "Igual que la tabla anterior, pero en este caso para suministro de álabes por orden.",
    placement: "top"
  },
      {
    element: ".ocupadaalabes:last",
    title: "Álabes en acumulación",
    content: "Estos iconos representan los álabes que se han suministrado (se ha pulsado el icono de carretilla en el listado superior). Corresponden por tanto a los álabes que hay en la zona de acumulación. Cada icono muestra la etapa, el serial number y el color correspondiente de forma automática cuando se suministra un juego de álabes por parte de almacén. Según se vayan consumiendo por parte de montaje, irán automáticamente desapareciendo. <strong>NOTA: pulsando sobre uno de los iconos, se elimina automáticamente y se considera que el disco ya no está en acumulación y ha sido consumido por montaje.</strong><br><img src=\"img/acualabes.png\">",
    placement: "right"
  },
        {
    element: ".bufferalabescurvicos",
    title: "Álabes etapa cúrvico en acumulación",
    content: "<img src=\"img/tour_curvicos.png\"><br>Este icono rodeado por el recuadro rojo representa el disco etapa de cúrvico que se ha suministrado (se ha pulsado el icono de carretilla en un disco con el icono <img src=\"img/discocurvico.png\"> en el listado superior). Según se consuma por parte de montaje, irá automáticamente desapareciendo. Sólo se permite un juego de cúrvicos. <strong>NOTA: pulsando sobre este icono, se elimina automáticamente (desaparece de esta lista) y se considera que el disco ya no está en acumulación.</strong><br><img src=\"img/acudiscos.png\">",
    placement: "right"
  },
    {
    element: "#encabezadongvs",
    title: "NGV'S para suministro",
    content: "Listado por orden de los NGV'S que necesitan suministrarse a montaje. Al igual que los listados anteriores, pulsando el icono de la carretilla se considera suministrado el NGV y se elimina de la tabla.",
    placement: "top"
  },
        {
    element: ".ocupadangv:last",
    title: "NGV'S en zona de acumulación",
    content: "Estos iconos representan los NGV'S que se han suministrado (se ha pulsado el icono de carretilla en el listado superior). Corresponden por tanto a los ngv's que hay en la zona de acumulación. Cada icono muestra la etapa, el serial number y el color correspondiente de forma automática cuando se suministra un juego de ngv's por parte de almacén. Según se vayan consumiendo por parte de montaje, irán automáticamente desapareciendo. <strong>NOTA: pulsando sobre uno de los iconos, se elimina automáticamente y se considera que el disco ya no está en acumulación y ha sido consumido por montaje.</strong><br><img src=\"img/acungvs.png\">",
    placement: "top"
  }
]});

$('.iniciar-tour').on('click', function(){
  localStorage.clear();
  tour.init();
  tour.restart(); 
});


});