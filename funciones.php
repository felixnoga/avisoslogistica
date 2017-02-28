
<?php
date_default_timezone_set('Europe/Madrid');
$pdo = new PDO('sqlite:db/database.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
require __DIR__.'/vendor/autoload.php';
use Almacen\Almacen;
use Almacen\LineaIntegracion;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\LineFormatter;

/*VARIABLES GLOBALES*/
$timestamp= time();
$hoy=date('d/m/Y', $timestamp); /*dd/mm/aaaa*/
$mes=date('n');
$dia=date('j');
$año=date('Y');
$iniciojornada=mktime(0, 0, 0, $mes, $dia, $año);/*segundos UNIX para el inicio de jornada de hoy*/
$finjornada=mktime(23, 59, 59, $mes, $dia, $año);/*segundos UNIX para el fin de jornada de hoy*/
	
/*FUNCION LOG MONOLOG */
	function logInfo ($message, $nameplate, $part) {
		// the default date format is "Y-m-d H:i:s"
		$dateFormat = "d-M-Y, H:i";
		// the default output format is "[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n"
		$output = "%datetime% => %level_name% => %message% \r\n";
		// finally, create a formatter
		$formatter = new LineFormatter($output, $dateFormat);
		
		// Create a handler
		$stream = new StreamHandler(__DIR__.'/logs/info_suministros_por_error.log', Logger::DEBUG);
		$stream->setFormatter($formatter);
		// bind it to a logger object
		$log = new Logger('informacion');
		$log->pushHandler($stream);
	// add records to the log
		$log->addInfo($message.' NAMEPLATE: '. $nameplate . 'PART (BD): '. $part);
	}			

/*FUNCION PARA PONER COMO SUMINISTRADO TANTO DISCO COMO ALABES CUANDO NO SE HAN SUMINISTRADO POR ERROR Y SE PONE LA INSPECCIÓN FINAL DE ROTOR */

	function suministrarPorErrorDiscoAlabes ($part, $plate){
		global $pdo;
		$time=time();
		if($part==7 || $part==8 || $part==9 ||$part==10 || $part==11 || $part==12){
			switch ((int)$part) {
				case 7:
					$disco=1;
					$alabes=46;
					break;
				case 8:
					$disco=2;
					$alabes=47;
					break;
				case 9:
					$disco=3;
					$alabes=48;
					break;
				case 10:
					$disco=4;
					$alabes=49;
					break;
				case 11:
					$disco=5;
					$alabes=50;
					break;	
				case 12:
					$disco=6;
					$alabes=51;
					break;																								
			}
			$statement=$pdo->query("SELECT COUNT(*) AS cont FROM programador WHERE disco_piezas_id_pieza=$disco AND nameplate='$plate' AND (enbufferalabes=1 OR enbuffer=1 OR suministrado_disco=0 OR suministrado_alabe=0)");

			$resultado=$statement->fetch(PDO::FETCH_ASSOC);
			var_dump($resultado);
			if ($resultado['cont']>0){
				echo 'suministrando';
				$pdo->query("UPDATE programador SET suministrado_disco=1, suministrado_alabe=1, enbufferalabes=0, enbuffer=0, time_last_suministro=$time, time_suministro_alabe=$time WHERE disco_piezas_id_pieza=$disco AND nameplate='$plate'");
				logInfo('Suministrados disco y alabes al llegar a inspección final de rotor', $plate, $part);
			}
		}	
		else {
			return;
		}
			
	
	} 

	function suministrarPorErrorNgv ($part, $plate){
		global $pdo;
		switch ((int)$part) {
			case 14:
				$etapa='LP2';
				break;
			case 15:
				$etapa='LP3';
				break;
			case 16:
				$etapa='LP4';
				break;
			case 17:
				$etapa='LP5';
				break;
			case 18:
				$etapa='LP6';
				break;	
		}
		$statement = $pdo->query ("SELECT COUNT(*) as cont FROM ngvs WHERE nameplate='$plate' AND etapa='$etapa' AND (suministrado=0 OR enbufferngv=1)");
		$resultado=$statement->fetch(PDO::FETCH_ASSOC);
		if ($resultado['cont']>0){
			$pdo->query("UPDATE ngvs SET suministrado=1, enbufferngv=0 WHERE nameplate='$plate' AND etapa='$etapa'");

		}
	}





/*SELECCIONAR MOTORES DE LA BASE DE DATOS Y ENVIARLOS VIA AJAX DE VUELTA*/

if (isset($_POST['pedir']) && $_POST['pedir']=="motor"){
		$resultado = $pdo->query('SELECT * FROM tipos_motor');	
		
		echo '<div class="form-group montaje motor">
					<label for="motor">Tipo de motor</label>
					<select class="form-control input-lg" id="motor" placeholder="Seleccionar tipo de motor">
									<option value=""></option>';
		foreach ($resultado as $value) {
			echo '<option value="'.$value['id_tipo'].'">'.$value['tipo'].'</option>';
		}
		echo'</select></div>';
}


/*SELECCIONAR PIEZAS DEPENDIENDO DEL TIPO DE MOTOR QUE SE HAYA SELECCIONADO Y ENVIARLOS VIA AJAX DE VUELTA*/

if (isset($_POST['motor'])){
	$tipo = $_POST['motor'];
	$zona=$_POST['zona'];
	$stmt=$pdo->prepare("SELECT * FROM piezas INNER JOIN motor_piezas ON piezas.id_pieza=motor_piezas.id_pieza INNER JOIN piezas_puestos ON motor_piezas.id_pieza=piezas_puestos.id_pieza INNER JOIN tipos_motor ON motor_piezas.id_motor=tipos_motor.id_tipo INNER JOIN puestos ON piezas_puestos.id_puesto=puestos.id_puesto WHERE puestos.id_puesto=:zona AND tipos_motor.id_tipo=:tipo ORDER BY piezas.pieza ASC");	
	$stmt->execute(array(':zona' =>$zona, ':tipo'=>$tipo));
	$resultado = $stmt->fetchAll();
	if (count($resultado)==0){
		echo '<div class="form-group montaje pieza has-error">
				<label for="pieza">Pieza</label>
				<select class="form-control input-lg error" id="pieza">
								<option value="">NO EXISTEN INSPECCIONES</option></div>';

	}
	else {
	echo '<div class="form-group montaje pieza">
				<label for="pieza">Pieza</label>
				<select class="form-control input-lg" id="pieza">
								<option value=""></option>';
								foreach ($resultado as $value) {
								echo '<option value="'.$value['id_pieza'].'">'.$value['pieza'].'</option>';
								};
						echo '</div>';	
	}
}

/*CREAR EL INPUT TIPO TEXTO PARA INTRODUCCIÓN DE NOMBRE DEL MONTADOR SI YA SE HA SELECCINADO LA PIEZA (LA PIEZA SOLO SE PUEDE SELECCIONAR SI TODO LO DEMÁS ESTÁ SELECCIONADO) */

if (isset($_POST['pieza'])){
	$insp = $_POST['pieza'];
	echo '<div class="form-group montaje form-inline nameplate">';
	echo '<label for="nameplate" class="control-label">Nameplate&nbsp</label>';
	echo'<input type="text" name="nameplate" class="input-lg nameplate form-control">';
	echo '</div>';
	echo '<div class="form-group montaje form-inline of">';
	echo '<label for="of" class="control-label">&nbspO.F.&nbsp</label>';
	echo'<input type="text" name="of" class="input-lg form-control">';
	echo '</div>';	
	echo '<div class="form-group montaje nombre">';
	echo '<label for="montador">Nombre del operario&nbsp</label>';
	echo'<input type="text" name="nombre" class="input-lg">';
	echo '</div>';	
}

/*INSERTAR EN LA BASE DE DATOS LA INSPECCIÓN QUE SE HA SOLICITADO */
if(isset($_POST['enviado'])){
	$eng =trim($_POST['eng']);
	$loc=trim($_POST['loc']);
	$part = trim($_POST['part']);
	$of=trim($_POST['of']);
	$montador = trim(ucfirst(strtolower($_POST['montador'])));
	$plate=strtoupper(trim($_POST['plate']));
	$stm=$pdo->prepare("SELECT COUNT(*) AS contador FROM inspecciones WHERE id_tipos_motor=:eng AND id_puestos=:loc AND id_piezas=:part AND nameplate=:plate");
	$stm->execute(array(':eng'=>$eng, ':loc'=>$loc, ':part'=>$part, ':plate'=>$plate));
	$resultado=$stm->fetch(PDO::FETCH_ASSOC);
	$contador=$resultado['contador'];
	//no devuelve nada si contador=0, ya que algunas instancias de Almacén envían respuestas en json y se mezclarían
	if ($contador==0) {
		$stm=$pdo->prepare("INSERT INTO inspecciones (id_tipos_motor, id_puestos, id_piezas, hora, montador, status, nameplate, of) VALUES (:eng, :loc, :part, :time, :montador, 0, :plate, :of)");
		$stm->execute(array(':eng'=>$eng, ':loc'=>$loc, ':part'=>$part, ':time'=>$timestamp, ':montador'=>$montador, ':plate'=>$plate, ':of'=>$of));
		var_dump($part);
		var_dump($plate);
		suministrarPorErrorDiscoAlabes($part, $plate);


 		if($part==14 || $part==15 || $part==16 || $part==17 || $part==18) {
 			suministrarPorErrorNgv($part, $plate);
 		}
	
		if ($part==31){
			$escariado = new LineaIntegracion();
			$escariado->addNextEscariado($plate);
		}
	
		if ($part==34){
			$case = new LineaIntegracion();
			$case->addNextCaseIp($plate);
		}	
	
		if ($part==35){
			$support = new LineaIntegracion();
			$support->addNextSupport($plate);
		}

		//Los álabes IP ahora se consumen manualmente	
		// if ($part==52){
		// 	$blades = new Almacen();
		// 	$blades->addNextBladeIp($plate);
		// }	

	}	
	//si contador=1 (ya existe esa inspección), no se instancia Almacén con lo que se puede retornar respuesta json
	else {
		Response::create(json_encode(array('contador'=>$contador)), Response::HTTP_OK, array('content-type'=>'application/json'))->send();
	}
}

/*FUNCIÓN DEL BOTÓN INICIAR DE LA TABLA DE INSPECCIONES. DEVUELVE VIA AJAX SI LA INSPECCIÓN YA ESTÁ OCUPADA */

if (isset($_POST['id'])){
	$datos = array('ocupado'=>'');
	$id=$_POST['id'];
	$stm=$pdo->prepare("SELECT * FROM inspecciones WHERE id=:id AND status=0");
	$stm->execute(array(':id' => $id));
    $result=$stm->fetchAll();
	$contador=count($result);
	if ($contador==0){
		$datos['ocupado']=1;
	}
	else {
		$datos['ocupado']=0;
	}
	echo json_encode($datos);
	
}

/*FUNCIÓN QUE SE EJECUTA SI LA INSPECCIÓN NO ESTABA OCUPADA Y SE HA INTRODUCIDO EL NOMBRE DEL INSPECTOR QUE LA VA A REALIZAR */

if (isset($_POST['inspector']) && isset($_POST['id'])){
	$stm=$pdo->prepare("UPDATE inspecciones SET id_inspector=:inspector, status=:status, horainicio=:horainicio WHERE id=:id");
	$stm->execute(array(':inspector'=>$_POST['inspector'], ':horainicio'=>$timestamp, ':status'=>1, ':id'=>$_POST['id']));
	echo "inicada la inspeccion";
}



/*FINALIZAR INSPECCIÓN AL PULSAR EL BOTÓN*/

if (isset($_POST['id']) && isset($_POST['finalizar']) && $_POST['finalizar']) {

	$stm=$pdo->prepare("UPDATE inspecciones SET status=2, horafin=? WHERE id=?");
	$stm->execute(array($timestamp, $_POST['id']));
}

/* CARGAR PRIMER SELECT (PUESTOS) EN PANTALLA DE MONTADORES */	

	if (isset($_POST['cargar']) && $_POST['cargar']=='zona'){	
		$resultado = $pdo->query('SELECT * FROM puestos');
			echo '<option selected="selected" value=""></option>';
			foreach ($resultado as $value) {
				echo '<option value="'.$value['id_puesto'].'">'.$value['puesto'].'</option>';
			}
	}	


/* DESHACER AL SELECCIONAR UNA INSPECCION */
if (isset($_POST['deshacer_id']) && ($_POST['deshacer_id']!='' OR $_POST['deshacer_id']!=null)){
	$deshacer_id=$_POST['deshacer_id'];
	$sentencia=$pdo->prepare("UPDATE inspecciones SET horainicio=:hi, horafin=:hf, id_inspector=:ii, status=:st WHERE id=:id");
	$sentencia->execute(array(':hi'=>NULL, ':hf'=>NULL, ':ii'=>NULL, ':st'=>0,':id'=>$deshacer_id));
	echo json_encode(array("eliminado"=>1));
	
}



/* CARGAR TABLAS DE INSPECCIONES NO FINALIZADAS */
	function search_array($needle, $haystack) {
     if(in_array($needle, $haystack)) {
          return $haystack['nombre'];
     }
     foreach($haystack as $element) {
          if(is_array($element) && search_array($needle, $element))
               return $element['nombre'];
     }
   return false;
}
	
	if (isset($_POST['tabla']) && $_POST['tabla']==1) {

		$resultados=$pdo->query("SELECT puestos.puesto, piezas.pieza, inspecciones.id, inspecciones.montador, inspecciones.nameplate, inspecciones.hora, inspecciones.horainicio, inspecciones.horafin, inspecciones.status, inspecciones.of, inspectores.inspector FROM inspecciones LEFT JOIN inspectores ON inspecciones.id_inspector=inspectores.id_inspector INNER JOIN piezas ON inspecciones.id_piezas=piezas.id_pieza  INNER JOIN tipos_motor ON inspecciones.id_tipos_motor=tipos_motor.id_tipo INNER JOIN puestos ON inspecciones.id_puestos=puestos.id_puesto WHERE inspecciones.status=0 OR inspecciones.status=1");
		$stm=$pdo->query("SELECT * FROM usuarios");
		$usuarios = $stm->fetchAll(PDO::FETCH_ASSOC);
		foreach($resultados as $res ){
			
			if ($res['status']==1){

				echo '<tr style="background-color: #D3FAC0">';					

			}
			else{

				if ($timestamp-$res['hora']>900){
					echo '<tr style="color: #C91F37">';
				}
				else {
					echo '<tr>';					
				}
			}	

			if ($timestamp-$res['hora']>900 && $res['status']==0){
				echo '<td>'.$res['puesto'].'<br><i class="fa fa-clock-o"></td>';
			}
			else {
				echo '<td>'.$res['puesto'].'</td>';
			}	
			echo '<td>'.$res['pieza'].'</td>';
			if ($montador = search_array($res['montador'], $usuarios)) {
				echo '<td>'.$montador.'</td>';
			}

			else {
				echo '<td>'.$res['montador'].'</td>';
			}
			
			echo '<td>'.$res['nameplate'].'</td>';
			if ($res['of']===NULL || $res['of']==='') {
				echo '<td><i class="fa fa-question-circle" aria-hidden="true"></i></td>';
			}
			else {
			echo '<td>'.$res['of'].'</td>';

			}

			if ($res['hora']!='' OR $res['hora']!=null){
			echo '<td>'.date('H:i:s', $res['hora']).'</td>';
			}
			else {
				echo '<td></td>';					
			}

			if ($res['horainicio']!='' OR $res['horainicio']!=null){
				echo '<td>'.date('H:i:s', $res['horainicio']).'</td>';
			}
			else {
				echo '<td></td>';			
			}

			if ($res['horafin']!='' && $res['horafin']!=null){
				echo '<td>'.date('H:i:s', $res['horafin']).'</td>';
			}
			else {
				echo '<td></td>';			
			}			
			
			if ($res['inspector']!='' OR $res['inspector']!=null) {
				echo '<td>'.$res['inspector'].'<a href="'.$res['id'].'"class="deshacer">&nbsp&nbsp<i class="fa fa-undo fa-lg"></i></a></td>';
			}
			else {
				echo '<td></td>';
			}

			if ($res['status']==0){
				echo '<td><a href="'.$res['id'].'" class="btn btn-success btn-sm iniciar">Iniciar</a></td>';
			}	
			
			if ($res['status']==1){
				echo '<td><a href="'.$res['id'].'" class="btn btn-warning btn-sm finalizar">Finalizar</a></td>';
			}

			echo '</tr>';
		
		}
	}

/* CARGAR TABLA DE INSPECCIONES FINALIZADAS */	

	if (isset($_POST['tabla']) && $_POST['tabla']==2) {

		$resultados=$pdo->query("SELECT puestos.puesto, piezas.pieza, inspecciones.montador, inspecciones.nameplate, inspecciones.hora, inspecciones.horainicio, inspecciones.horafin, inspectores.inspector FROM inspecciones INNER JOIN inspectores ON inspecciones.id_inspector=inspectores.id_inspector INNER JOIN piezas ON inspecciones.id_piezas=piezas.id_pieza  INNER JOIN tipos_motor ON inspecciones.id_tipos_motor=tipos_motor.id_tipo INNER JOIN puestos ON inspecciones.id_puestos=puestos.id_puesto WHERE inspecciones.status=2 AND inspecciones.hora BETWEEN $iniciojornada AND $finjornada ORDER BY inspecciones.hora DESC");
	
		foreach($resultados as $res ){
			echo '<tr>';
			echo '<td>'.$res['puesto'].'</td>';
			echo '<td>'.$res['pieza'].'</td>';
			echo '<td>'.$res['montador'].'</td>';
			echo '<td>'.$res['nameplate'].'</td>';
			echo '<td>'.date('H:i:s', $res['hora']).'</td>';
			echo '<td>'.date('H:i:s', $res['horainicio']).'</td>';
			echo '<td>'.date('H:i:s', $res['horafin']).'</td>';
			echo '<td>'.$res['inspector'].'</td>';
			echo '</tr>';
		
		}
	}


/*CARGA INSPECTORES DESDE LA BASE DE DATOS Y LOS INSERTA COMO OPTIONS EN EL SELECT PARA EL DIÁLOGO DE SELECCIÓN DE INSPECTORES */

	if(isset($_POST['select_inspectores']) && $_POST['select_inspectores']){
		$stat=$pdo->prepare("SELECT * FROM inspectores");
		$stat->execute();
		$inspectores=$stat->fetchAll();
		//echo "<select>";
		echo '<option value="" selected="selected">Seleccionar inspector...</option>';
		foreach ($inspectores as $insp) {
			echo '<option value="'.$insp['id_inspector'].'">'.$insp['inspector'].'</option>';

		}
		//echo '</select>';
	}	

/*PROCESAR LA FECHA DE LA TABLA 2 PARA SELECCIONAR LAS INSPECCIONES FINALIZADAS POR FECHA*/
	if (isset($_POST['fecha']) && $_POST['tabla']="fecha")	{
		$fecha=$_POST['fecha'];
		$descompuesta=explode('/', $fecha);
		$dia=$descompuesta[0];
		$mes=$descompuesta[1];
		$año=$descompuesta[2];
		$inicio=mktime(0, 0, 0, $mes, $dia, $año); //segundos unix a las 0:0:0 de la fecha recibida
		$fin=mktime(23, 59, 59, $mes, $dia, $año); //segundos unix a las 23:59:59 de la fecha recibida
		$statement=$pdo->prepare("SELECT hora, montador, horainicio, horafin, nameplate, inspector, pieza, puesto, status FROM inspecciones INNER JOIN inspectores ON inspecciones.id_inspector=inspectores.id_inspector INNER JOIN piezas ON inspecciones.id_piezas=piezas.id_pieza  INNER JOIN tipos_motor ON inspecciones.id_tipos_motor=tipos_motor.id_tipo INNER JOIN puestos ON inspecciones.id_puestos=puestos.id_puesto WHERE status=2 AND hora BETWEEN $inicio AND $fin ORDER BY hora DESC");
		$statement->execute();
		$resultados=$statement->fetchAll();
		

		foreach ($resultados as $res) {
			echo '<tr>';
			echo '<td>'.$res['puesto'].'</td>';
			echo '<td>'.$res['pieza'].'</td>';
			echo '<td>'.$res['montador'].'</td>';
			echo '<td>'.$res['nameplate'].'</td>';
			echo '<td>'.date('H:i:s', $res['hora']).'</td>';
			echo '<td>'.date('H:i:s', $res['horainicio']).'</td>';
			echo '<td>'.date('H:i:s', $res['horafin']).'</td>';
			echo '<td>'.$res['inspector'].'</td>';
			echo '</tr>';
			
		}
	}


/*SE HA PULSADO EL BOTON INFO EN LA PANTALLA DE MONTADORES PARA RECUPERAR DE LA BASE LAS INSPECCIONES PENDIENTES DE INSPECCIÓN */

	if (isset($_POST['infopendientes']) && $_POST['infopendientes']==1){
		$statement=$pdo->prepare("SELECT hora, pieza, nameplate, puesto, montador, status, tipo FROM inspecciones INNER JOIN tipos_motor ON inspecciones.id_tipos_motor=tipos_motor.id_tipo INNER JOIN piezas ON inspecciones.id_piezas=piezas.id_pieza INNER JOIN puestos ON inspecciones.id_puestos=puestos.id_puesto WHERE inspecciones.status=0 OR inspecciones.status=1 ORDER BY hora ASC");
		$statement->execute();
		$resultados=$statement->fetchAll();
		$numero=count($resultados);
		if ($numero===0){
			echo '<tr id="sininsp">';
			echo '<td colspan="5">NO HAY INSPECCIONES PENDIENTES.</td>';
			echo "<tr>";
		}
		foreach ($resultados as $key) {
			echo "<tr>";
			echo '<td>'.date('H:i',$key['hora']).'</td>';
			echo "<td><strong>".$key['pieza']."</strong></td>";
			echo "<td>".$key['tipo']."</td>";
			echo "<td><strong>".$key['nameplate']."</strong></td>";
			echo "<td>".$key['montador']."</td>";
			echo "</tr>";
		}
	}

/*OBTENER DATOS DE CIERRES DOCUMENTALES DE NGV'S Y ENVIARLOS DE VUELTA VIA AJAX JSON */

	if (isset($_POST['seriengv'])) {
		$nameplate = $_POST['seriengv'];
		$statement = $pdo->prepare("SELECT * FROM inspecciones WHERE nameplate=:nameplate AND id_piezas BETWEEN 14 AND 18");
		$statement->execute(array(':nameplate' => $nameplate));
		$arrayresultados = $statement->fetchAll(PDO::FETCH_ASSOC);
		$response = new JsonResponse($arrayresultados);
		$response->send();
	}

