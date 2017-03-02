<?php  namespace Almacen;
use Symfony\Component\HttpFoundation\Response;

class Almacen {

	var $pdo;
    var $respuesta = array();

	public function __construct(){
		$this->pdo = new \PDO('sqlite:db/database.db');
	}	

	public function showDiscosNoSuministrados(){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.tipos_motor_id_tipo AS tipomotor, P.stock_alabe AS stocka, P.stock_disco AS stockdis, P.availability_disco, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.disco_piezas_id_pieza=PI.id_pieza WHERE suministrado_disco=0 ORDER BY P.orden ASC LIMIT 30');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
        $salida='';
       	foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 0, 3);
				if ($key['stockdis']==0){
					$salida.= '<tr class="danger" data-id="'.$key['id'].'">';
				}
				else if ($key['availability_disco']==0 && $key['stockdis']==1){
                    $salida.= '<tr class="warning" data-id="'.$key['id'].'">';
                }
				else{
					$salida.= '<tr data-id="'.$key['id'].'">';
				}
				
				$salida.= '<td>'.$key['nam'].' </td>';
				//Añadir C en etapas con curvicos
				
				if (($key['tipomotor']==1 && $etapa=='LP3') || ($key['tipomotor']==2 && $etapa=='LP4') || ($key['tipomotor']!=1 && $key['tipomotor']!=2 && $etapa=='LP5'))	{
					$salida.= '<td> DISCO '.$etapa.' <img src="img/discocurvico.png"></td>';
				}
				else {
					$salida.= '<td> DISCO '.$etapa.'</td>';
				}	
				
			
				$salida.= '<td>'.$key['tipo'].'</td>';
				
				if ($key['stockdis']==0){
					$salida.= '<td><i class="fa fa-exclamation-circle fa-2x"></i></td>';
				}
                else if ($key['stockdis']==1 && $key['availability_disco']==0) {
                    $salida.= '<td><i class="fa fa-hand-stop-o fa-2x"></i></td>';
                }
				else {
					$pattern='/^[BSJRYP]/i';					
					if (preg_match($pattern, $key['nam'])){					
						$salida.= '<td class="suministrar"><a class="suministrardisco" href="'.$key['id'].'"><img src="img/lindedes.png" /></a></td>';
					}	
					else {
						$salida.= '<td class="suministrar"><a class="suministrardisco" href="'.$key['id'].'"><img src="img/linde.png" /></a></td>';
					}	

				}			
				$salida.= '</tr>';
		}
        Response::create($salida, Response::HTTP_OK, array('content-type'=>'text/html'))->send();
	}

	public function showDiscosNoSuministradosSinCarretilla(){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.tipos_motor_id_tipo AS tipomotor, P.stock_alabe AS stocka, P.stock_disco AS stockdis, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.disco_piezas_id_pieza=PI.id_pieza WHERE suministrado_disco=0 ORDER BY P.orden ASC LIMIT 6');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
        $salida='';
       	foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 0, 3);
				if ($key['stockdis']==0){
					$salida.= '<tr class="danger" data-id="'.$key['id'].'">';
				}
				else{
					$salida.= '<tr data-id="'.$key['id'].'">';
				}
				
				$salida.= '<td><strong>'.$key['nam'].' </strong></td>';
				//Añadir C en etapas con curvicos
				
				if (($key['tipomotor']==1 && $etapa=='LP3') || ($key['tipomotor']==2 && $etapa=='LP4') || ($key['tipomotor']!=1 && $key['tipomotor']!=2 && $etapa=='LP5'))	{
					$salida.= '<td><strong> DISCO '.$etapa.'</strong> <img src="img/discocurvico.png"></td>';
				}
				else {
					$salida.= '<td><strong> DISCO '.$etapa.'</strong></td>';
				}	
				
			
				$salida.= '<td>'.$key['tipo'].'</td>';
				
				if ($key['stockdis']==0){
					$salida.= '<td><i class="fa fa-exclamation-circle fa-2x"></i></td>';
				}

				$salida.= '</tr>';
		}
        Response::create($salida, Response::HTTP_OK, array('content-type'=>'text/html'))->send();
	}			


	public function showAlabesNoSuministrados(){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.tipos_motor_id_tipo AS tipomotor, P.stock_alabe AS stocka, P.stock_disco AS stockdis, P.availability_alabe, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.alabe_piezas_id_pieza=PI.id_pieza WHERE suministrado_alabe=0 ORDER BY P.orden ASC LIMIT 30');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
        $salida='';
		foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 7, 10);
				if ($key['stocka']==0){
					$salida.= '<tr class="danger" data-id="'.$key['id'].'">';
				}
                else if ($key['availability_alabe']==0 && $key['stocka']==1){
                    $salida.= '<tr class="warning" data-id="'.$key['id'].'">';
                }
				else{
					$salida.= '<tr data-id="'.$key['id'].'">';
				}	

				$salida.= '<td>'.$key['nam'].'</td>';
				if (($key['tipomotor']==1 && $etapa=='LP3') || ($key['tipomotor']==2 && $etapa=='LP4') || ($key['tipomotor']!=1 && $key['tipomotor']!=2 && $etapa=='LP5'))	{
					$salida.= '<td>'.$key['pieza'].' <img src="img/discocurvico.png"></td>';
				}
				else {
					$salida.= '<td>'.$key['pieza'].'</td>';
				}	
				$salida.= '<td>'.$key['tipo'].'</td>';
				if ($key['stocka']==0){
					$salida.= '<td><i class="fa fa-exclamation-circle fa-2x"></i></td>';
				}
				else if ($key['stocka']==1 && $key['availability_alabe']==0) {
                    $salida.= '<td><i class="fa fa-hand-stop-o fa-2x"></i></td>';
                }
				else {
					$pattern='/^[BSJRYP]/i';
					if (preg_match($pattern, $key['nam'])){
						$salida.= '<td class="suministrar"><a class="suministraralabe" href="'.$key['id'].'"><img src="img/lindedes.png" /></a></td>';	
					}
					else {
						$salida.= '<td class="suministrar"><a class="suministraralabe" href="'.$key['id'].'"><img src="img/linde.png" /></a></td>';
					}	
				}
				$salida.= '</tr>';
		}
        Response::create($salida, Response::HTTP_OK, array('content-type'=>'text/html'))->send();
	}

	public function showAlabesNoSuministradosSinCarretilla(){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.tipos_motor_id_tipo AS tipomotor, P.stock_alabe AS stocka, P.stock_disco AS stockdis, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.alabe_piezas_id_pieza=PI.id_pieza WHERE suministrado_alabe=0 ORDER BY P.orden ASC LIMIT 6');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
        $salida='';
		foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 7, 10);
				if ($key['stocka']==0){
					$salida.= '<tr class="danger" data-id="'.$key['id'].'">';
				}
				else{
					$salida.= '<tr data-id="'.$key['id'].'">';
				}	

				$salida.= '<td><strong>'.$key['nam'].'</strong></td>';
				if (($key['tipomotor']==1 && $etapa=='LP3') || ($key['tipomotor']==2 && $etapa=='LP4') || ($key['tipomotor']!=1 && $key['tipomotor']!=2 && $etapa=='LP5'))	{
					$salida.= '<td><strong>'.$key['pieza'].' </strong><img src="img/discocurvico.png"></td>';
				}
				else {
					$salida.= '<td><strong>'.$key['pieza'].'</strong></td>';
				}	
				$salida.= '<td>'.$key['tipo'].'</td>';
				if ($key['stocka']==0){
					$salida.= '<td><i class="fa fa-exclamation-circle fa-2x"></i></td>';
				}
				$salida.= '</tr>';
		}
        Response::create($salida, Response::HTTP_OK, array('content-type'=>'text/html'))->send();
	}	

	public function suministrarAlabe($id){
		$id=(int)$id;
		if ($stm=$this->pdo->query('UPDATE programador SET suministrado_alabe=1, enbufferalabes=1 WHERE id='.$id)) {
        	Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}	
		
		else {
            Response::create(json_encode(array('error'=>1)), Response::HTTP_OK, array('content-type'=>'application/json'))->send();
		}		

	}

	public function suministrarDisco($id, $nameplate, $etapa){

		$time = time();
		$stm = $this->pdo->prepare('UPDATE programador SET suministrado_disco=1, enbuffer=1, time_last_suministro=:time WHERE id= :id');
		$stm->execute(array(':time'=>$time, ':id'=>$id));			
		//PEDIR NGV AL SUMINISTRAR UN DISCO YA QUE NO SE PONE AVISO DE INSPECCIÓN. EL CHEQUEO LO HACE LA FUNCIÓN insertarNgv (etapa distinta a la LP1)
		$this->insertarNgv(trim($nameplate), trim($etapa));	
		
		Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
	}

    public function suministrarDiscoDesdeMontaje($nameplate, $etapa){

        $time = time();
        $stm= $this->pdo->prepare('SELECT COUNT(*) as numero FROM programador WHERE nameplate=:nameplate AND disco_piezas_id_pieza=:etapa AND suministrado_disco=0');
        $stm->execute(array(':nameplate'=>$nameplate, ':etapa'=>$etapa));
        $resultado = $stm->fetch(\PDO::FETCH_ASSOC);
        $numero=$resultado['numero'];
        if ($numero==0) {
        	$array=['error'=>1];
        }
        else {
        	$array=['error'=>0];
        }
        $stm = $this->pdo->prepare('UPDATE programador SET suministrado_disco=1, enbuffer=0, time_last_suministro=:time WHERE nameplate= :nameplate AND disco_piezas_id_pieza = :etapa');
        $stm->execute(array(':time'=>$time, ':nameplate'=>$nameplate, ':etapa'=>$etapa));
        //PEDIR NGV AL SUMINISTRAR UN DISCO YA QUE NO SE PONE AVISO DE INSPECCIÓN. EL CHEQUEO LO HACE LA FUNCIÓN insertarNgv (etapa distinta a la LP1)
		switch ($etapa) {
			case 1:
				$etapa='LP1';
				break;
			case 2:
				$etapa='LP2';
				break;	
			case 3:
				$etapa='LP3';
				break;
			case 4:
				$etapa='LP4';
				break;
			case 5:
				$etapa='LP5';
				break;	
			case 6:
				$etapa='LP6';
				break;																		
		}     
		if ($etapa!='LP1'){
	        $this->insertarNgv(trim($nameplate), trim($etapa));
		}   
        Response::create(json_encode($array), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
    }

	public function getBufferDiscos(){
		$stm = $this->pdo->query('SELECT * FROM programador WHERE enbuffer=1 AND suministrado_disco=1');
		$data= $stm->fetchAll(\PDO::FETCH_ASSOC);
        Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
	}

	public function getBufferAlabes(){
		$stm = $this->pdo->query('SELECT * FROM programador WHERE enbufferalabes=1 AND suministrado_alabe=1');
		$data= $stm->fetchAll(\PDO::FETCH_ASSOC);
        Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();;
	}

	public function restarBufferDiscoAlmacen ($id) {
		$stm = $this->pdo->query("UPDATE programador SET enbuffer=0 WHERE id=$id");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
	}

	public function restarBufferDiscoMontaje ($id) {
		$stm=$this->pdo->query("SELECT nameplate, disco_piezas_id_pieza FROM programador WHERE id=$id");
		$resultado = $stm->fetch(\PDO::FETCH_ASSOC);
		$nameplate = $resultado['nameplate'];
		$pieza = (int)$resultado['disco_piezas_id_pieza'];
		switch ($pieza) {
			case 1:
				$etapa='LP1';
				break;
			case 2:
				$etapa='LP2';
				break;	
			case 3:
				$etapa='LP3';
				break;
			case 4:
				$etapa='LP4';
				break;
			case 5:
				$etapa='LP5';
				break;	
			case 6:
				$etapa='LP6';
				break;																		
		}
		if ($etapa!='LP1'){
			$this->insertarNgv($nameplate, $etapa);		
		}		

		$stm = $this->pdo->query("UPDATE programador SET enbuffer=0 WHERE id=$id");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
	}	

	public function restarBufferNgv ($id) {
		$stm = $this->pdo->query("UPDATE ngvs SET enbufferngv=0 WHERE id=$id");
	}

	public function restarBufferAlabes ($id){
				$stm = $this->pdo->query('UPDATE programador SET enbufferalabes=0 WHERE id='.$id);
				$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		 	
	}

    public function restarBufferAlabesSinSuministrar ($nameplate, $parte){
        $stm= $this->pdo->prepare('SELECT COUNT(*) as numero FROM programador WHERE nameplate=:nameplate AND alabe_piezas_id_pieza=:etapa');
        $stm->execute(array(':nameplate'=>$nameplate, ':etapa'=>$parte));
        $resultado = $stm->fetch(\PDO::FETCH_ASSOC);
        $numero=$resultado['numero'];
        if ($numero==0) {
        	$array=['error'=>1];
        }
        else {
        	$array=['error'=>0];
        }    	

        $stm = $this->pdo->prepare("UPDATE programador SET enbufferalabes=0, suministrado_alabe=1 WHERE nameplate=:nameplate AND alabe_piezas_id_pieza = :id");
        if($stm->execute(array(':nameplate'=>$nameplate, ':id'=>$parte))) {
            Response::create(json_encode($array), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }

    }

    public function restarBufferNgvsSinSuministrar ($nameplate, $etapa){
    	$stm = $this->pdo->prepare("SELECT COUNT(*) as numero FROM ngvs WHERE nameplate=:nameplate AND etapa=:etapa AND suministrado=0");
    	$stm->execute(array(':nameplate'=>$nameplate, ':etapa'=>$etapa));
		$resultado = $stm->fetch(\PDO::FETCH_ASSOC);
		$contador = $resultado['numero'];
		if($contador != 0){
	        $stm = $this->pdo->prepare("UPDATE ngvs SET enbufferngv=0, suministrado=1 WHERE nameplate=:nameplate AND etapa=:etapa");
	        if($stm->execute(array(':nameplate'=>$nameplate, ':etapa'=>$etapa))) {
	            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
	        }			
		}
		else {
			Response::create(json_encode(array('error'=>1)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

    }

	public function insertarNgv ($nameplate, $etapa){
		$timestamp=time();	
		try {
			if ($etapa != 'LP1'){
				$statem=$this->pdo->prepare("INSERT INTO ngvs(nameplate, timestamp_requerido, etapa, suministrado) VALUES(:nameplate, :time, :etapa, 0)");
				$statem->execute(array(':nameplate'=>$nameplate, ':time' => $timestamp, ':etapa'=>$etapa));			
			}	
		} 
		catch (\PDOException $e) {
			echo json_encode(array('error'=>$e->getMessage()));
		}

	}

	public function getNgvs (){
		$now = time();
		try {
			$tabla='';
			$stm = $this->pdo->prepare("SELECT * FROM ngvs WHERE suministrado=0 AND enbufferngv=0");
			$stm->execute();
			$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
            foreach ($resultados as $key) {
				$dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
				$diarequerido = $dias[date('w', $key['timestamp_requerido'])];
				$numdiarequerido =date('d', $key['timestamp_requerido']);
				$horarequerido = date('H:i', $key['timestamp_requerido']);
				$tabla.='<tr>';
				$tabla.='<td>'.$key['nameplate'].'</td>';
				$tabla.='<td>'.$key['etapa'].'</td>';
				$tabla.='<td>'.$diarequerido.' '.$numdiarequerido.' - '.$horarequerido.'</td>';
				$tabla.='<td class="suministrar"><a class="suministrarngv" href="'.$key['id'].'"><img src="img/linde.png" /></a></td>';
				$tabla.='<tr>';

			}
            Response::create($tabla, Response::HTTP_OK, array('Content-Type'=>'text/html'))->send();
		}
		catch(\PDOException $e){

		}
	}

	public function getNgvsSinCarretilla (){
		$now = time();
		try {
			$tabla='';
			$stm = $this->pdo->prepare("SELECT * FROM ngvs WHERE suministrado=0 and timestamp_requerido<=$now");
			$stm->execute();
			$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
            foreach ($resultados as $key) {
				$dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
				$diarequerido = $dias[date('w', $key['timestamp_requerido'])];
				$numdiarequerido =date('d', $key['timestamp_requerido']);
				$horarequerido = date('H:i', $key['timestamp_requerido']);
				$tabla.='<tr>';
				$tabla.='<td><strong>'.$key['nameplate'].'</strong></td>';
				$tabla.='<td><strong>'.$key['etapa'].'</strong></td>';
				$tabla.='<td>'.$diarequerido.' '.$numdiarequerido.' - '.$horarequerido.'</td>';
				$tabla.='<tr>';

			}
            Response::create($tabla, Response::HTTP_OK, array('Content-Type'=>'text/html'))->send();
		}
		catch(\PDOException $e){

		}
	}	
	public function suministrarNgvs($id){

			$stm = $this->pdo->prepare('UPDATE ngvs SET suministrado=1, enbufferngv=1 WHERE id= :id');
			$stm->execute(array( ':id'=>$id));
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
	}

	public function getBufferNgvs(){
		$stm = $this->pdo->query('SELECT id, nameplate, etapa FROM ngvs WHERE suministrado=1 AND enbufferngv=1');
		$ngvs= $stm->fetchAll(\PDO::FETCH_ASSOC);
		$data = $ngvs;
        Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
	}	
	/**
	 * Función que añade $hours horas dentro de la jornada de trabajo. Si quedan menos de $hours para el fin de jornada,
	 * lo pasa al dia siguiente a partir de las 7:25. Si es viernes, lo pasa al sábado. Si es sábado y quedan menos de
	 * $hours hasta las 14:00, lo pasa al lunes a las 7:25.
	 * @param int $hours Horas que queremos añadir a la hora actual dentro del horario laboral.
	 * @return int Timestamp de la fecha después de haber sumado $hours al horario laboral.
	 */
	protected function addWorkingHours($hours){
		$now = time();
		$finjornadahoy = mktime(23, 35, 00);
		$finjornadasabado = mktime(14,00,00);
		$tomorrow = date ('w', strtotime('tomorrow'));//0-domingo, 6-sabado
		//si quedan mas de $hours horas para el fin de jornada
		if ($finjornadahoy-$now>($hours*60*60)){ 
			//si es sábado
			if ($tomorrow==0){
				//si siendo sabado, quedan más de $hours horas para las 14:00
				if ($finjornadasabado-$now>($hours*60*60)){
					//el tiempo requerido va a recaer en la jornada del sabado
					$timerequerido= $now + ($hours*60*60);
				}
				//si siendo sabado, quedan menos de $hours horas para las 14:00, le sumamos 41horas 25 minutos hasta el inicio el lunes a las 7:25, mas sus 5 horas normales del proceso
				else {
					$timerequerido = $now+($hours*60*60)+(41*60*60)+(25*60);
				}	
			}
			//si no es sábado (lunes a viernes) y quedan más de $hours horas para el final de jornada, le sumamos las 5 horas del proceso. 
			else {
				$timerequerido=$now+($hours*60*60);
			}
		}	
			//si quedan menos de $hours horas para el fin de jornada (no puede ser sábado ni domingo, ya que el aviso se ha puesto de tarde), le sumamos sus $hours horas y la noche.
			//Pudiera ser viernes, el aviso recaería entonces el sábado siguiente. Lo dejamos así para cubrir posibles jornadas de sábado.
		else {
			$timerequerido = $now + ($hours*60*60)+(7*60*60)+(50*60);
		}	
		return $timerequerido;
			
	}

	/**
	 * Funcion que añade 1 al nameplate y lo introduce en la tabla escariado para que almacén tenga
	 * constancia de que disco/eje IP es el siguiente para reponer
	 * @param $nameplate Es el nameplate de la inspección actual. Se le añade 1 en la función.
     */


	public function suministrarEscariado ()	{
		if($stm=$this->pdo->prepare("DELETE FROM escariado")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}

	public function getNextCaseIp () {
		$data = array();
		$stm=$this->pdo->query("SELECT nameplate, time_pedido FROM case_ip");
		if($resultados=$stm->fetch(\PDO::FETCH_ASSOC)){
			$data['nameplate']=$resultados['nameplate'];
			$meses = array('Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic');
			$mes = $meses[date('n')-1];
			$requerido = date("H:i (d", $resultados['time_pedido']);
			$requerido.=" $mes)";
			$data['time']=$requerido;
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();;
		}
		else {
			$data['error']='si';
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

	}


	public function getNextSupport () {
		$data = array();
		$stm=$this->pdo->query("SELECT nameplate, time_pedido FROM soporte_hp");
		if($resultados=$stm->fetch(\PDO::FETCH_ASSOC)){
			$data['nameplate']=$resultados['nameplate'];
			$meses = array('Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic');
			$mes = $meses[date('n')-1];
			$requerido = date("H:i (d", $resultados['time_pedido']);
			$requerido.=" $mes)";
			$data['time']=$requerido;
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}
		else {
			$data['error']='si';
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

	}

	public function addNextBladeIp ($nameplate){
		$nameplatemodified = (int)substr($nameplate, -4)+1;
		$newnameplate = 'DE'.$nameplatemodified;
		$now = time();
		try {
			if($stm=$this->pdo->prepare("DELETE * FROM alabes_ip")) {
                $stm->execute();
            }

			$this->pdo->query("INSERT into alabes_ip(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
			$data['error']=0;
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();		

		}
		catch (\PDOException $e){
			echo $e->getMessage();
		}
	}

    public function addNextSoporte ($nameplate){
        $nameplatemodified = (int)substr($nameplate, -4)+1;
        $newnameplate = 'DE'.$nameplatemodified;
        $now = time();
        try {
            if($stm=$this->pdo->prepare("DELETE * FROM alabes_ip")) {
                $stm->execute();
            }

            $this->pdo->query("INSERT into soporte_hp(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
            $data['error']=0;
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

        }
        catch (\PDOException $e){
            echo $e->getMessage();
        }
    }

	public function getNextBladeIp () {
		$data = array();
		$stm=$this->pdo->query("SELECT nameplate, time_pedido FROM alabes_ip");
		if($resultados=$stm->fetch(\PDO::FETCH_ASSOC)){
			$data['nameplate']=$resultados['nameplate'];
			$meses = array('Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic');
			$mes = $meses[date('n')-1];
			$requerido = date("H:i (d", $resultados['time_pedido']);
			$requerido.=" $mes)";
			$data['time']=$requerido;
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}
		else {
			$data['error']='si';
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

	}		

	public function getNextNgvLp1 () {
		$data = array();
		$stm=$this->pdo->query("SELECT nameplate, time_pedido FROM ngv_lp1");
		if($resultados=$stm->fetch(\PDO::FETCH_ASSOC)){
			$data['nameplate']=$resultados['nameplate'];
			$meses = array('Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic');
			$mes = $meses[date('n')-1];
			$requerido = date("H:i (d", $resultados['time_pedido']);
			$requerido.=" $mes)";
			$data['time']=$requerido;
			$stm2=$this->pdo->query("SELECT ngvlp1 FROM cajas_vacias");
			$resultado=$stm2->fetch(\PDO::FETCH_ASSOC);
			$data['vacias']=$resultado['ngvlp1'];
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}
		else {
			$data['error']='si';
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

	}	

	public function getNextNgvIp () {
		$data = array();
		$stm=$this->pdo->query("SELECT nameplate, time_pedido FROM ngv_ip");
		if($resultados=$stm->fetch(\PDO::FETCH_ASSOC)){
			$data['nameplate']=$resultados['nameplate'];
			$meses = array('Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic');
			$mes = $meses[date('n')-1];
			$requerido = date("H:i (d", $resultados['time_pedido']);
			$requerido.=" $mes)";
			$data['time']=$requerido;
			$stm2=$this->pdo->query("SELECT ngvip FROM cajas_vacias");
			$resultado=$stm2->fetch(\PDO::FETCH_ASSOC);
			$data['vacias']=$resultado['ngvip'];
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}
		else {
			$data['error']='si';
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
		}

	}		

	public function suministrarSupport ()	{
        if($stm=$this->pdo->prepare("DELETE FROM soporte_hp")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}	

	public function suministrarCase ()	{
        if($stm=$this->pdo->prepare("DELETE FROM case_ip")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}

	public function suministrarNgvLp1 ()	{
        if($stm=$this->pdo->prepare("DELETE FROM ngv_lp1")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}	

	public function suministrarNgvIp ()	{
        if($stm=$this->pdo->prepare("DELETE FROM ngv_ip")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}

    public function suministrarCaseIp ()	{
        if($stm=$this->pdo->prepare("DELETE FROM case_ip")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
    }
    public function suministrarSoporte ()	{
        if($stm=$this->pdo->prepare("DELETE FROM soporte_hp")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
    }

	public function suministrarBladeIp ()	{
        if($stm=$this->pdo->prepare("DELETE FROM alabes_ip")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
	}

    public function suministrarCaseLp ()	{
        if($stm=$this->pdo->prepare("DELETE FROM carcasa_lp")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
    }	

    public function suministrarTbh ()	{
        if($stm=$this->pdo->prepare("DELETE FROM tbh")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
    }	  

    public function suministrarEjeLp ()	{
        if($stm=$this->pdo->prepare("DELETE FROM eje_lp")) {
            $stm->execute();
            Response::create(json_encode(array('error'=>0)), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
        }
    }	      
	public function addNextNgvLp1 ($nameplate){
		$nameplatemodified = (int)substr($nameplate, -4)+1;
		$newnameplate = 'DE'.$nameplatemodified;
		$now = time();
		$data=array();
		try {
			$stm=$this->pdo->prepare("DELETE FROM ngv_lp1");
			$stm->execute();
			$this->pdo->query("INSERT into ngv_lp1(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
			$this->pdo->query("UPDATE cajas_vacias SET ngvlp1=ngvlp1+1");
			$data=array('error'=> 0);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

		}
		catch (\PDOException $e){
			$tipo= $e->getMessage();
			$data=array ('error'=>$tipo);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

		}

	}

	public function addNextNgvIp ($nameplate){
		$nameplatemodified = (int)substr($nameplate, -4)+1;
		$newnameplate = 'DE'.$nameplatemodified;
		$now = time();
		$data=array();
		try {
			$stm=$this->pdo->prepare("DELETE FROM ngv_ip");
			$stm->execute();
			$this->pdo->query("INSERT into ngv_ip(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
			$data=array('error'=> 0);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

		}
		catch (\PDOException $e){
			$tipo= $e->getMessage();
			$data=array ('error'=>$tipo);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

		}

	}

    public function addNextCaseIp ($nameplate){
        $nameplatemodified = (int)substr($nameplate, -4)+1;
        $newnameplate = 'DE'.$nameplatemodified;
        $now = time();
        try {
            $stm=$this->pdo->prepare("DELETE FROM case_ip");
            $stm->execute();
            $this->pdo->query("INSERT into case_ip(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
            $data=array('error'=> 0);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

        }
        catch (\PDOException $e){
            $tipo= $e->getMessage();
            $data=array ('error'=>$tipo);
            Response::create(json_encode($data), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();

        }

    }

	public function deshacerSuministroDisco (){ 
		$stm=$this->pdo->query("SELECT tipos_motor_id_tipo FROM programador WHERE time_last_suministro=(SELECT max(time_last_suministro) FROM programador)");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);	
		if ($resultado['tipos_motor_id_tipo'] == 2 || $resultado['tipos_motor_id_tipo'] == 3 || $resultado['tipos_motor_id_tipo'] == 4 || $resultado['tipos_motor_id_tipo'] == 5 || $resultado['tipos_motor_id_tipo'] == 6)	
		{
			$this->pdo->query("UPDATE programador SET suministrado_disco=0, time_last_suministro=0 WHERE time_last_suministro=(SELECT max(time_last_suministro) FROM programador)");
		}	

		else
		{
			$this->pdo->query("UPDATE programador SET suministrado_disco=0, time_last_suministro=0 WHERE time_last_suministro=(SELECT max(time_last_suministro) FROM programador)");
		}		
	}	

	public function deshacerSuministroAlabes (){ 
		$stm=$this->pdo->query("SELECT alabe_piezas_id_pieza AS id, tipos_motor_id_tipo AS tipo FROM programador WHERE time_suministro_alabe=(SELECT max(time_suministro_alabe) FROM programador)");
		$updatestm=$this->pdo->prepare("UPDATE programador SET suministrado_alabe=0, time_suministro_alabe=0 WHERE time_suministro_alabe=(SELECT max(time_suministro_alabe) FROM programador)");
	}

	public function checkBufferQty () {
		$stm=$this->pdo->query("SELECT COUNT (*) AS contador FROM programador WHERE enbufferalabes=1 AND ((alabe_piezas_id_pieza!=48 AND tipos_motor_id_tipo=1) OR (alabe_piezas_id_pieza!=49 AND tipos_motor_id_tipo=2) OR (alabe_piezas_id_pieza!=50 AND tipos_motor_id_tipo BETWEEN 3 AND  8))");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$alabes = $resultado['contador'];
		$stm=$this->pdo->query("SELECT COUNT (*) AS contador FROM programador WHERE enbufferalabes=1 AND ((alabe_piezas_id_pieza=48 AND tipos_motor_id_tipo=1) OR (alabe_piezas_id_pieza=49 AND tipos_motor_id_tipo=2) OR (alabe_piezas_id_pieza=50 AND tipos_motor_id_tipo BETWEEN 3 AND  8))");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$alabescurvicos = $resultado['contador'];
		$stm=$this->pdo->query("SELECT COUNT (*) AS contador FROM programador WHERE enbuffer=1 AND ((disco_piezas_id_pieza!=3 AND tipos_motor_id_tipo=1) OR (disco_piezas_id_pieza!=4 AND tipos_motor_id_tipo=2) OR (disco_piezas_id_pieza!=5 AND tipos_motor_id_tipo BETWEEN 3 AND  8))");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$discos= $resultado['contador'];
		$stm=$this->pdo->query("SELECT COUNT (*) AS contador FROM programador WHERE enbuffer=1 AND ((disco_piezas_id_pieza=3 AND tipos_motor_id_tipo=1) OR (disco_piezas_id_pieza=4 AND tipos_motor_id_tipo=2) OR (disco_piezas_id_pieza=5 AND tipos_motor_id_tipo BETWEEN 3 AND  8))");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$curvicos= $resultado['contador'];		
		$stm=$this->pdo->query("SELECT COUNT (*) AS contador FROM ngvs WHERE enbufferngv=1");
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$ngvs=$resultado['contador'];
		Response::create(json_encode(['bufferqtydiscos'=>$discos, 'buffercurvicos'=>$curvicos,'bufferqtyalabes'=>$alabes,'bufferalabescurvicos'=>$alabescurvicos,'bufferqtyngvs'=>$ngvs]), Response::HTTP_OK, array('Content-Type'=>'application/json'))->send();
    }

						


}