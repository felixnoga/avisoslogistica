<?php
//autoloader de composer
require('../vendor/autoload.php');
date_default_timezone_set('Europe/Madrid');

try {
$pdo=new PDO ('sqlite:../db/database.db');
}
catch (PDOException $e){
	echo "Ha ocurrido un error al conectar a la base de datos<br/>";
	echo $e->getMessage();
}

if (isset($_GET['fecha'])) {

	$fecha = $_GET['fecha'];
	$fechadescompuesta = explode ('/', $fecha);

	$mes = $fechadescompuesta[1];
	$dia = $fechadescompuesta[0];
	$año = $fechadescompuesta[2];

	$inicio = mktime (0,0,0, $mes, $dia, $año);
	$fin = mktime (23, 59, 59, $mes, $dia, $año);

	$statement = $pdo->prepare("SELECT puestos.puesto, piezas.pieza, inspecciones.id, inspecciones.montador, inspecciones.nameplate, inspecciones.hora, inspecciones.horainicio, inspecciones.horafin, inspecciones.status, inspectores.inspector  FROM inspecciones LEFT JOIN inspectores ON inspecciones.id_inspector=inspectores.id_inspector INNER JOIN piezas ON inspecciones.id_piezas=piezas.id_pieza  INNER JOIN tipos_motor ON inspecciones.id_tipos_motor=tipos_motor.id_tipo INNER JOIN puestos ON inspecciones.id_puestos=puestos.id_puesto WHERE inspecciones.status=2 AND inspecciones.hora BETWEEN ? AND ? ORDER BY inspecciones.hora DESC");
	$statementdiscos = $pdo->prepare("SELECT COUNT(*) AS numdiscos FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 1");
	$statementrotores = $pdo->prepare("SELECT COUNT(*) AS numrotores FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 2");
	$statementescariado = $pdo->prepare("SELECT COUNT(*) AS numescariado FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 3");
	$statementestatico = $pdo->prepare("SELECT COUNT(*) AS numestatico FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND (id_puestos = 4 OR id_puestos=5 OR id_puestos=7)");
	$statementngvs = $pdo->prepare("SELECT COUNT(*) AS numngvs FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 6");
	$statementip = $pdo->prepare("SELECT COUNT(*) AS numip FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 8");
	$statementdesarrollo = $pdo->prepare("SELECT COUNT(*) AS numdesarrollo FROM inspecciones WHERE status=2 AND hora BETWEEN ? AND ? AND id_puestos = 9");

	$statement->execute(array($inicio, $fin));
	$resultados=$statement->fetchAll(PDO::FETCH_ASSOC);
	$numinspecciones = count($resultados);

	$statementdiscos->execute(array($inicio, $fin));
	$rowsdiscos=$statementdiscos->fetch(PDO::FETCH_ASSOC);
	$numdiscos = $rowsdiscos['numdiscos'];

	$statementrotores->execute(array($inicio, $fin));
	$rowsrotores=$statementrotores->fetch(PDO::FETCH_ASSOC);
	$numrotores = $rowsrotores['numrotores'];

	$statementescariado->execute(array($inicio, $fin));
	$rowsescariado=$statementescariado->fetch(PDO::FETCH_ASSOC);
	$numescariado = $rowsescariado['numescariado'];

	$statementestatico->execute(array($inicio, $fin));
	$rowsestatico=$statementestatico->fetch(PDO::FETCH_ASSOC);
	$numestatico = $rowsestatico['numestatico'];

	$statementngvs->execute(array($inicio, $fin));
	$rowsngvs=$statementngvs->fetch(PDO::FETCH_ASSOC);
	$numngvs = $rowsngvs['numngvs'];

	$statementip->execute(array($inicio, $fin));
	$rowsip=$statementip->fetch(PDO::FETCH_ASSOC);
	$numip = $rowsip['numip'];

	$statementdesarrollo->execute(array($inicio, $fin));
	$rowsdesarrollo=$statementdesarrollo->fetch(PDO::FETCH_ASSOC);
	$numdesarrollo = $rowsdesarrollo['numdesarrollo'];		

	//CREAMOS EL OBJETO PHPEXCEL Y LA HOJA

	$objPHPExcel = new PHPExcel();
	$hoja = $objPHPExcel->getSheet(); //no se especifica número de hoja, con lo que la primera es retornada

	//CONFIGURAR METADATA DEL ARCHIVO EXCEL

	$objPHPExcel->getProperties()->setCreator("Félix Nogales")
                            	 ->setLastModifiedBy("Félix Nogales")
                            	 ->setTitle("Informe avisos inspección")
                             	 ->setSubject("Informe de avisos")
                             	 ->setDescription("Informe de avisos")
                             	 ->setKeywords("informe avisos inspección");                             
	
	//CONFIGURAR ENCABEZADOS -COLOR DE RELLENO Y FUENTE-

	$hoja->getStyle('A2:H2')->applyFromArray(
   		 array(
     	   'fill' => array(
       		    'type' => PHPExcel_Style_Fill::FILL_SOLID,
          		'color' => array('rgb' => '3498db')
       			),
     	   'font' => array(
     	   		'bold' => true,
     	   		'color' => array('rgb' => 'ecf0f1'),
     	   		'size'	=> 12
     	   		)
   		 )
	);

	$hoja->getStyle('A1:H1')->applyFromArray(
   		 array(
     	   'fill' => array(
       		    'type' => PHPExcel_Style_Fill::FILL_SOLID,
          		'color' => array('rgb' => '89C4F4')
       			),
     	   'font' => array(
     	   		'bold' => true,
     	   		'color' => array('rgb' => 'ecf0f1'),
     	   		'size'	=> 18
     	   		)
   		 )
	);	



	//INSERTAR TÍTULOS DE ENCABEZADOS

	$hoja->mergeCells('A1:H1');
	$hoja->setCellValue('A1', 'INFORME DE INSPECCIONES '.$fecha);
	$hoja->setCellValue('A2', 'PUESTO');
	$hoja->setCellValue('B2', 'INSPECCIÓN');
	$hoja->setCellValue('C2', 'FITTER');
	$hoja->setCellValue('D2', 'NAMEPLATE');
	$hoja->setCellValue('E2', 'HORA AVISO');
	$hoja->setCellValue('F2', 'HORA INICIO INSPECC.');
	$hoja->setCellValue('G2', 'HORA FIN INSPECC.');
	$hoja->setCellValue('H2', 'INSPECTOR');

	
	$numero = 3;	
	

	foreach ($resultados as $res) {
		$hoja->setCellValue('A'.$numero, $res['puesto']);
	 	$hoja->setCellValue('B'.$numero, $res['pieza']);
	 	$hoja->setCellValue('C'.$numero, $res['montador']);
	 	$hoja->setCellValue('D'.$numero, $res['nameplate']);
	 	$hoja->setCellValue('E'.$numero, date('H:i', $res['hora']));
	 	$hoja->setCellValue('F'.$numero, date('H:i', $res['horainicio']));
	 	$hoja->setCellValue('G'.$numero, date('H:i', $res['horafin']));
	 	$hoja->setCellValue('H'.$numero, $res['inspector']);
	 	$numero++;
	 } 

	 //CREACIÓN CELDAS DE TOTALES 

	 $rowmax = $hoja->getHighestRow();
	 $hoja->getStyle('B'.($rowmax+2).':H'.($rowmax+9))->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_NONE);
	 $hoja->getStyle('A'.($rowmax+2).':A'.($rowmax+9))->getFont()->setSize(10);
	 $hoja->getStyle('A'.($rowmax+2).':A'.($rowmax+9))->getFont()->setName('Arial');
	 $hoja->getStyle('A'.($rowmax+2).':B'.($rowmax+9))->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('E68364');

	 $hoja->setCellValue('A'.($rowmax+2), 'TOTAL INSPECCIONES:');
	 $hoja->setCellValue('B'.($rowmax+2), $numinspecciones);
	 $hoja->setCellValue('A'.($rowmax+3), 'DISCOS:');
	 $hoja->setCellValue('B'.($rowmax+3), $numdiscos);
	 $hoja->setCellValue('A'.($rowmax+4), 'ROTORES:');
	 $hoja->setCellValue('B'.($rowmax+4), $numrotores); 
	 $hoja->setCellValue('A'.($rowmax+5), 'ESCARIADO:'); 
	 $hoja->setCellValue('B'.($rowmax+5), $numescariado);
	 $hoja->setCellValue('A'.($rowmax+6), 'ESTÁTICO:'); 
	 $hoja->setCellValue('B'.($rowmax+6), $numestatico);
	 $hoja->setCellValue('A'.($rowmax+7), 'LINEA IP:');  
	 $hoja->setCellValue('B'.($rowmax+7), $numip);
	 $hoja->setCellValue('A'.($rowmax+8), 'NGV\'S:'); 
	 $hoja->setCellValue('B'.($rowmax+8), $numngvs);
	 $hoja->setCellValue('A'.($rowmax+9), 'DESARROLLO:'); 
	 $hoja->setCellValue('B'.($rowmax+9), $numdesarrollo);

	 //ANCHO DE COLUMNAS EN AUTO

	$hoja->getColumnDimension('A')->setAutosize(true);
	$hoja->getColumnDimension('B')->setAutosize(true);
	$hoja->getColumnDimension('C')->setAutosize(true);
	$hoja->getColumnDimension('D')->setAutosize(true);
	$hoja->getColumnDimension('E')->setAutosize(true);
	$hoja->getColumnDimension('F')->setAutosize(true);
	$hoja->getColumnDimension('G')->setAutosize(true);
	$hoja->getColumnDimension('H')->setAutosize(true);	 
	$hoja->getStyle('A1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
	$hoja->getStyle('A3:H500')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

	//EXPORTAR EL ARCHIVO ENVIANDO ENCABEZADOS DE HOJA EXCEL FORMATO 2007 .xlsx

	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="informe'.$fecha.'.xlsx"');
	header('Cache-Control: max-age=0');
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");
	$objWriter->save('php://output');

	exit;

}