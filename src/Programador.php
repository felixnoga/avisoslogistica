<?php namespace Almacen;

class Programador {
	var $pdo;
	var $id_pieza_disco;
	var $id_pieza_alabe;
	var $orden;
	var $tipo;

	public function __construct(){
		$this->pdo = new \PDO('sqlite:db/database.db');
		$this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

	}

	public function addDiscoAlabes ($etapa, $nameplate, $tipo){

		//tipo de motor
		$stm = $this->pdo->prepare('SELECT id_tipo from tipos_motor WHERE id_tipo = :tipo');
		$stm->execute(array(":tipo"=> $tipo));
		$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
		$this->tipo = $resultado['id_tipo'];	
		var_dump($this->tipo);	

		//orden máximo
		$stm = $this->pdo->query('SELECT max(orden) as maximo FROM programador');
		$res = $stm->fetch(\PDO::FETCH_ASSOC);
		$this->orden = $res['maximo']+1;
		var_dump($this->orden);
		var_dump($etapa);
		var_dump($nameplate);

		
		//chequear que el parámetro $etapa no sea igual a 'todas_etapas' y meter la etapa en particular (el checkbox del incluir todas las etapas no se ha checkeado y se mete la etapa individual seleccionada)
		if ($etapa!='todas_etapas'){

			$stm = $this->pdo->prepare('SELECT id_pieza from piezas WHERE pieza = :etapa');
			$stm->execute(array(":etapa"=> $etapa." DISC"));
			$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
			$this->id_pieza_disco = $resultado['id_pieza'];

			$stm = $this->pdo->prepare('SELECT id_pieza from piezas WHERE pieza = :etapa');
			$stm->execute(array(":etapa"=> "ALABES ".$etapa));
			$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
			$this->id_pieza_alabe = $resultado['id_pieza'];

			$stm=$this->pdo->query("SELECT COUNT(*) as cont FROM programador WHERE (disco_piezas_id_pieza=$this->id_pieza_disco OR alabe_piezas_id_pieza=$this->id_pieza_alabe) AND nameplate='$nameplate'");
			$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
			$cont=$resultado['cont'];
			if ($cont==0){
				$stm = $this->pdo->prepare('INSERT INTO programador (disco_piezas_id_pieza, alabe_piezas_id_pieza, nameplate, stock_disco, stock_alabe, suministrado_disco, suministrado_alabe, orden, tipos_motor_id_tipo) VALUES (:iddisco, :idalabe, :nameplate, :stockdisco, :stockalabe, :suministradodisco, :suministradoalabe, :orden, :tipo)');
				$stm->execute(array(':iddisco' => $this->id_pieza_disco , ':idalabe' => $this->id_pieza_alabe, ':nameplate'=> $nameplate, ':stockdisco' => 1, ':stockalabe'=>1, ':suministradodisco'=> 0, ':suministradoalabe'=> 0,':orden'=> $this->orden, ':tipo'=>$this->tipo));
				$this->showNoSuministrados();
			}
			else {
				header('Content-Type: application/json');
				echo json_encode(array('error'=>'existe'));
			}
		}

		//si se ha seleccionado el checkbox todas las etapas, se meten todas las etapas de una vez con un loop (4 etapas para T700 y T900 y 6 para el resto de motores)	
		else {
			//si es T700 hay 4 etapas
			if ($tipo==1) {
				for ($i=0; $i<4; $i++){
					$this->id_pieza_disco=$i+1;
					$this->id_pieza_alabe=$i+46;
					$stm=$this->pdo->query("SELECT COUNT(*) as cont FROM programador WHERE (disco_piezas_id_pieza=$this->id_pieza_disco OR alabe_piezas_id_pieza=$this->id_pieza_alabe) AND nameplate='$nameplate'");
					$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
					$cont=$resultado['cont'];
					if ($cont==0){
						$stm = $this->pdo->prepare('INSERT INTO programador (disco_piezas_id_pieza, alabe_piezas_id_pieza, nameplate, stock_disco, stock_alabe, suministrado_disco, suministrado_alabe, orden, tipos_motor_id_tipo) VALUES (:iddisco, :idalabe, :nameplate, :stockdisco, :stockalabe, :suministradodisco, :suministradoalabe, :orden, :tipo)');
						$stm->execute(array(':iddisco' => $this->id_pieza_disco , ':idalabe' => $this->id_pieza_alabe, ':nameplate'=> $nameplate, ':stockdisco' => 1, ':stockalabe'=>1, ':suministradodisco'=> 0, ':suministradoalabe'=> 0,':orden'=> $this->orden, ':tipo'=>$this->tipo));
					}						
				}
				$this->showNoSuministrados();
			}

			//si es T900 hay 5 etapas
			elseif ($tipo==2) {
				for ($i=0; $i<5; $i++){
					$this->id_pieza_disco=$i+1;
					$this->id_pieza_alabe=$i+46;
					$stm=$this->pdo->query("SELECT COUNT(*) as cont FROM programador WHERE (disco_piezas_id_pieza=$this->id_pieza_disco OR alabe_piezas_id_pieza=$this->id_pieza_alabe) AND nameplate='$nameplate'");
					$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
					$cont=$resultado['cont'];
					if ($cont==0){
						$stm = $this->pdo->prepare('INSERT INTO programador (disco_piezas_id_pieza, alabe_piezas_id_pieza, nameplate, stock_disco, stock_alabe, suministrado_disco, suministrado_alabe, orden, tipos_motor_id_tipo) VALUES (:iddisco, :idalabe, :nameplate, :stockdisco, :stockalabe, :suministradodisco, :suministradoalabe, :orden, :tipo)');
						$stm->execute(array(':iddisco' => $this->id_pieza_disco , ':idalabe' => $this->id_pieza_alabe, ':nameplate'=> $nameplate, ':stockdisco' => 1, ':stockalabe'=>1, ':suministradodisco'=> 0, ':suministradoalabe'=> 0,':orden'=> $this->orden, ':tipo'=>$this->tipo));
					}						
				}
				$this->showNoSuministrados();
			}

			//para el resto el loop es de 6 vueltas ya que hay 6 etapas
			else {
				for ($i=0; $i<6; $i++){
					$this->id_pieza_disco=$i+1;
					$this->id_pieza_alabe=$i+46;
					var_dump($this->id_pieza_disco);
					var_dump($this->id_pieza_alabe);
					$stm=$this->pdo->query("SELECT COUNT(*) as cont FROM programador WHERE (disco_piezas_id_pieza=$this->id_pieza_disco OR alabe_piezas_id_pieza=$this->id_pieza_alabe) AND nameplate='$nameplate'");
					$resultado=$stm->fetch(\PDO::FETCH_ASSOC);
					$cont=$resultado['cont'];					
					if ($cont==0){
						$stmt = $this->pdo->prepare('INSERT INTO programador (disco_piezas_id_pieza, alabe_piezas_id_pieza, nameplate, stock_disco, stock_alabe, suministrado_disco, suministrado_alabe, orden, tipos_motor_id_tipo) VALUES (:iddisco, :idalabe, :nameplate, :stockdisco, :stockalabe, :suministradodisco, :suministradoalabe, :orden, :tipo)');
						$stmt->execute(array(':iddisco' => $this->id_pieza_disco , ':idalabe' => $this->id_pieza_alabe, ':nameplate'=> $nameplate, ':stockdisco' => 1, ':stockalabe'=>1, ':suministradodisco'=> 0, ':suministradoalabe'=> 0,':orden'=> $this->orden, ':tipo'=>$this->tipo));
					}						
				}
				$this->showNoSuministrados();
			}			
		}	



	}

	public function getTiposMotor (){
		$stm = $this->pdo->query('SELECT * FROM tipos_motor');
		$stm->execute();
		$resultados = $stm->fetchAll(\PDO::FETCH_ASSOC);
		echo '<p class="seleccion-motor">Selecciona tipo de motor:</p>';
		echo '<div class="radio">';
		foreach ($resultados as $key) {
			echo '<div class="radio-tipos"><label><input type="radio" name="tipo-programador" value="'.$key['id_tipo'].'">'.$key['tipo'].'</label></div>';

		}
		echo '<div class="clearfix"></div></div>';
	}

	public function showNoSuministrados(){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.suministrado_alabe, P.suministrado_disco, P.tipos_motor_id_tipo,P.availability_alabe, P.availability_disco, P.stock_alabe AS stocka, P.stock_disco AS stockdis, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.disco_piezas_id_pieza=PI.id_pieza WHERE P.suministrado_disco=0 OR P.suministrado_alabe=0 ORDER BY P.orden ASC');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);
		foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 0, 3);
				echo '<div class="row conmargen" id="'.$key['id'].'">';
				switch ($key['tipo']) {
    				case "T700":
        				echo '<div class="col-xs-3 t700 alabe">';
       					 break;
   					 case "T900":
      					  echo '<div class="col-xs-3 t900 alabe">';
      					  break;
   					 case "T1000":
        				echo '<div class="col-xs-3 t1000 alabe">';
       				 	break;
   					 case "TXWB":
        				echo '<div class="col-xs-3 txwb alabe">';
       				 	break;
                    case "TXWB97K":
                        echo '<div class="col-xs-3 txwb97K alabe">';
                        break;
                    case "T1000 TEN":
        				echo '<div class="col-xs-3 t1000ten alabe">';
       				 	break;       				 	    				 	
   					 case "T7000":
        				echo '<div class="col-xs-3 t7000 alabe">';
       				 	break; 
       				 case "OTROS":
       				 	echo '<div class="col-xs-3 otros alabe">';	 
       				 	break;  
       				default:
       					echo '<div class="col-xs-3">';
       						
				}
				echo '<h6><span class="etapablades">'. $etapa.'</span></h6>';
				if (preg_match("/^Y/i",$key['nam'])){				
					echo '<h5 class="noventa">'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo-noventa"><i class="fa fa-ellipsis-v"></i> '.$key['tipo'].'</span>';
				}
				else {
					echo '<h5>'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo"><i class="fa fa-ellipsis-v"></i> '.$key['tipo'].'</span>';
				}	
				
				if ($key['stocka']==0){
					echo '<i class="fa fa-exclamation-circle nostock"></i>';
				}
				if ($key['availability_alabe']==0) {
					echo '<i class="fa fa-hand-stop-o noavailable"></i>';
				}
				if ($key['suministrado_alabe']==1){
					echo '<img class="suministrado" src="img/suministrado.png" />';
				}
				echo '</div>';
		
				switch ($key['tipo']) {
    				case "T700":
        				echo '<div class="col-xs-3 t700 disco">';
       					 break;
   					 case "T900":
      					  echo '<div class="col-xs-3 t900 disco">';
      					  break;
   					 case "T1000":
        				echo '<div class="col-xs-3 t1000 disco">';
       				 	break;
   					 case "TXWB":
        				echo '<div class="col-xs-3 txwb disco">';
       				 	break;
                    case "TXWB97K":
                        echo '<div class="col-xs-3 txwb97K disco">';
                        break;
   					 case "T1000 TEN":
        				echo '<div class="col-xs-3 t1000ten disco">';
       				 	break;         				 	
   					 case "T7000":
        				echo '<div class="col-xs-3 t7000 disco">';
       				 	break;  
       				 case "OTROS":
       				 	echo '<div class="col-xs-3 otros disco">';	   
       				 	break;    				 	  
       				default:
       					echo '<div class="col-xs-3">';
       						
				}

				if ($key['stockdis']==0){
					echo '<i class="fa fa-exclamation-circle nostock"></i>';
				}

				if ($key['availability_disco']==0) {
					echo '<i class="fa fa-hand-stop-o noavailable"></i>';
				}								

				echo '<h6><span class="etapadisc">'. $etapa.'</span></h6>';
				if (preg_match("/^Y/i",$key['nam'])){				
					echo '<h5 class="noventa">'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo-noventa"><i class="fa fa-ellipsis-v"></i> '.$key['tipo'].'</span>';
				}
				else {
					echo '<h5>'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo"><i class="fa fa-ellipsis-v"></i> '.$key['tipo'].'</span>';
				}
				if ($key['suministrado_disco']==1){
					echo '<img class="suministrado" src="img/suministrado.png" />';
				}				
				echo '</div>';
				echo '<div class="col-xs-1 borrar-placa"><button class="btn btn-xs btn-danger eliminar-programa"><i class="fa fa-trash"></i></button></div>';
				echo '</div>';
			}	

	}

	public function showLastSuministrados (){

		$stm = $this->pdo->query('SELECT P.id AS id, P.nameplate AS nam, P.suministrado_alabe, P.suministrado_disco, P.time_last_suministro, P.tipos_motor_id_tipo, P.stock_alabe AS stocka, P.stock_disco AS stockdis, T.tipo AS tipo, PI.pieza AS pieza FROM programador P INNER JOIN tipos_motor T ON P.tipos_motor_id_tipo=T.id_tipo 
			INNER JOIN piezas PI ON P.disco_piezas_id_pieza=PI.id_pieza WHERE P.suministrado_disco=1 AND P.suministrado_alabe=1 ORDER BY P.time_last_suministro DESC LIMIT 30');
		$resultados=$stm->fetchAll(\PDO::FETCH_ASSOC);



		foreach ($resultados as $key) {
				$etapa=substr($key['pieza'], 0, 3);
				echo '<div class="row conmargen" id="'.$key['id'].'">';
				switch ($key['tipo']) {
    				case "T700":
        				echo '<div class="col-xs-3 t700 alabe">';
       					 break;
   					 case "T900":
      					  echo '<div class="col-xs-3 t900 alabe">';
      					  break;
   					 case "T1000":
        				echo '<div class="col-xs-3 t1000 alabe">';
       				 	break;
   					 case "TXWB":
        				echo '<div class="col-xs-3 txwb alabe">';
       				 	break;   
   					 case "T1000 TEN":
        				echo '<div class="col-xs-3 t1000ten alabe">';
       				 	break;       				 	    				 	
   					 case "T7000":
        				echo '<div class="col-xs-3 t7000 alabe">';
       				 	break;   
       				 case "TXWB97K":
       				 	echo '<div class="col-xs-3 txwb97K alabe">';	
       				 	break;         				 	 
       				 case "OTROS":
       				 	echo '<div class="col-xs-3 otros alabe">';	
       				 	break;       				 	
       				default:
       					echo '<div class="col-xs-3">';
       						
				}
				echo '<h6><span class="etapablades">'. $etapa.'</span></h6>';
				if (preg_match("/^Y/i",$key['nam'])){				
					echo '<h5 class="noventa">'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo-noventa">'.$key['tipo'].'</span>';
				}
				else {
					echo '<h5>'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo">'.$key['tipo'].'</span>';
				}
				if ($key['stocka']==0){
					echo '<i class="fa fa-exclamation-circle fa-2x nostock"></i>';
				}
				if ($key['suministrado_alabe']==1){
					echo '<img class="suministrado" src="img/suministrado.png" />';
				}
				echo '</div>';
				//echo '<div class="col-xs-1"></div>';

				switch ($key['tipo']) {
    				case "T700":
        				echo '<div class="col-xs-3 t700 disco">';
       					 break;
   					 case "T900":
      					  echo '<div class="col-xs-3 t900 disco">';
      					  break;
   					 case "T1000":
        				echo '<div class="col-xs-3 t1000 disco">';
       				 	break;
   					 case "TXWB":
        				echo '<div class="col-xs-3 txwb disco">';
       				 	break;   
   					 case "T1000 TEN":
        				echo '<div class="col-xs-3 t1000ten disco">';
       				 	break;         				 	
   					 case "T7000":
        				echo '<div class="col-xs-3 t7000 disco">';
       				 	break;  
   					 case "TXWB97K":
        				echo '<div class="col-xs-3 txwb97K disco">';
       				 	break;       				 	 
       				 case "OTROS":
       				 	echo '<div class="col-xs-3 otros alabe">';	
       				 	break;	
       				default:
       					echo '<div class="col-xs-3">';
       						
				}

				if ($key['stockdis']==0){
					echo '<i class="fa fa-exclamation-circle fa-2x nostock"></i>';
				}								

				echo '<h6><span class="etapadisc">'. $etapa.'</span></h6>';
				if (preg_match("/^Y/i",$key['nam'])){				
					echo '<h5 class="noventa">'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo-noventa">'.$key['tipo'].'</span>';
				}
				else {
					echo '<h5>'.$key['nam'].'</h5>';
					echo '<span class="placa-tipo">'.$key['tipo'].'</span>';
				}
				
				if ($key['suministrado_disco']==1){
					echo '<img class="suministrado" src="img/suministrado.png" />';
				}				
				echo '</div>';
				echo '</div>';
			}			
	}

	public function ordenar (Array $items){
		$stm = $this->pdo->prepare('UPDATE programador SET orden=:orden WHERE id= :id');
		foreach ($items as $key => $value) {
			$stm->execute(array(':orden' => $key+1, ':id' => $value ));
		
		}
	}

	public function setStockAlabe ($id, $stock){
		$stm = $this->pdo->prepare('UPDATE programador SET stock_alabe=:stock WHERE id= :id');
		$stm->execute(array(':stock'=>$stock, ':id'=>$id));

	}

	public function setAvailabilityAlabes ($id, $availabilty){
		$stm = $this->pdo->prepare('UPDATE programador SET availability_alabe=:availability WHERE id= :id');
		$stm->execute(array(':availability'=>$availabilty, ':id'=>$id));

	}	


	public function setStockDisco ($id, $stock){
		$stm = $this->pdo->prepare('UPDATE programador SET stock_disco=:stock WHERE id= :id');
		$stm->execute(array(':stock'=>$stock, ':id'=>$id));

	}

	public function setAvailabilityDisco ($id, $availabilty){
		$stm = $this->pdo->prepare('UPDATE programador SET availability_disco=:availability WHERE id= :id');
		$stm->execute(array(':availability'=>$availabilty, ':id'=>$id));

	}

	public function borrarPrograma($id){
		$stm = $this->pdo->prepare('DELETE from programador WHERE id=:id');
		$stm->execute(array(':id'=>$id));

	}

    public function getFechasFaltantes(){
        $stm = $this->pdo->query('SELECT * from fecha_archivo');
        $resultados = $stm->fetch(\PDO::FETCH_ASSOC);
        echo '<p class="subir-faltantes">ULTIMA ACTUALIZACIÓN FALTANTES <strong>T700</strong>: '.$resultados['fecha_t700'];
        echo '<p class="subir-faltantes">ULTIMA ACTUALIZACIÓN FALTANTES <strong>SAP</strong>: '.$resultados['fecha'];

    }

	public function quitarSuministro($id, $parte) {
		if ($parte==='disco'){
			$this->pdo->query("UPDATE programador SET suministrado_disco=0 WHERE id=".$id."");
		}
		elseif ($parte==='alabes')	{
			$this->pdo->query("UPDATE programador SET suministrado_alabe=0 WHERE id=".$id."");
		}
		else {
			echo json_encode(array('error'=>'si'));
		}
	}

	public static function corregirNameplates ($nameplate) {
        if (preg_match('/^D8/i', $nameplate)) {
            return preg_replace('/^D8/i', 'DH', $nameplate);
        }
        else if (preg_match('/^D\d/i', $nameplate)) {
            return preg_replace('/^D/i', 'DH', $nameplate);
        }
        else if (preg_match('/^H8/i', $nameplate)) {
            return preg_replace('/^H8/i', 'HH', $nameplate);
        }
        else if (preg_match('/^H\d/i', $nameplate)) {
            return preg_replace('/^H/i', 'HH', $nameplate);
        }
        else if (preg_match('/^X8/i', $nameplate)) {
            return preg_replace('/^X8/i', 'XG', $nameplate);
        }
        else if (preg_match('/^X\d/i', $nameplate)) {
            return preg_replace('/^X/i', 'XG', $nameplate);
        }
        else if (preg_match('/^M8/i', $nameplate)) {
             return preg_replace('/^M8/i', 'MG', $nameplate);
        }
        else if (preg_match('/^M\d/i', $nameplate)) {
            return preg_replace('/^M/i', 'MG', $nameplate);
        }
        else if (preg_match('/^Y\d/i', $nameplate)) {
            return preg_replace('/^Y/i', 'YH', $nameplate);
        }
        else if (preg_match('/^N8/i', $nameplate)) {
            return preg_replace('/^N8/i', 'NG', $nameplate);
        }
        else if (preg_match('/^N\d/i', $nameplate)) {
            return preg_replace('/^N/i', 'NG', $nameplate);
        }
        else {
            return strtoupper($nameplate);
        }
    }

	public function procesarArrayExcelProgramacion ($arrayexcel) {

		/*Borrar del array excel los juegos que ya se han suministrado (tanto disco como alabe) */

		$stm = $this->pdo->query("SELECT * FROM programador WHERE suministrado_disco=1 AND suministrado_alabe=1");
		$resultados = $stm->fetchAll(\PDO::FETCH_ASSOC);
		foreach ($resultados as $row) {
			foreach ($arrayexcel as $index=>$subarray) {
				if (in_array($row['nameplate'], $subarray) && in_array($row['disco_piezas_id_pieza'], $subarray)) {
					array_splice($subarray, $index, 1);
				}
			}
		}


		

		$stm2 = $this->pdo->query("SELECT * FROM programador WHERE suministrado_disco=0 OR suministrado_alabe=0 ORDER BY orden ASC");
		$resultados2 = $stm2->fetchAll(\PDO::FETCH_ASSOC);
		/*Poner al principio de la programación los juegos que no estén en el array excel*/
		$i=1;
		foreach ($resultados2 as $row) {
			$en_array=false;
			foreach ($arrayexcel as $index=>$subarray) {
				if (in_array($row['nameplate'], $subarray) && in_array($row['disco_piezas_id_pieza'], $subarray)) {
					$en_array=true;
					break;
				}
			}
			if (!$en_array) {
				$this->pdo->query("UPDATE programador SET orden=$i WHERE id=".$row['id']."");
				$i++;
			}
		}
		/*Meter todos los juegos del array del excel en db. Si están en db, UPDATE. Si no, INSERT*/
		$orden = $i;
		foreach ($arrayexcel as $index => $subarray) {
            $stma=$this->pdo->prepare("SELECT COUNT(*) AS cont FROM programador WHERE (suministrado_disco=0 OR suministrado_alabe=0) AND nameplate=:nameplate AND disco_piezas_id_pieza=:disco");
            $stma->execute(array(':nameplate'=>$subarray['nameplate'], ':disco'=>$subarray['etapa']));
            $cont = $stma->fetch(\PDO::FETCH_ASSOC);
            $n = (int)$cont['cont'];
            if ($n===1) {
                $stm=$this->pdo->prepare("UPDATE programador SET orden=$orden WHERE (suministrado_disco=0 OR suministrado_alabe=0) AND nameplate=:nameplate AND disco_piezas_id_pieza=:disco");
                $stm->execute(array(':nameplate'=>$subarray['nameplate'], ':disco'=>$subarray['etapa']));
                $orden++;
            }
            else {
                $stm=$this->pdo->prepare("INSERT INTO programador (orden, suministrado_disco, suministrado_alabe, nameplate, disco_piezas_id_pieza, alabe_piezas_id_pieza, tipos_motor_id_tipo) VALUES($orden, 0, 0, :nameplate, :disco, :alabe, :tipo)");
                $alabeid=(int)$subarray['etapa']+45;
                $stm->execute(array(':nameplate'=>$subarray['nameplate'], ':disco'=>$subarray['etapa'], ':alabe'=>$alabeid, ':tipo' => $subarray['tipo_motor']));
                $orden++;
            }
		}


		
	}
	

}