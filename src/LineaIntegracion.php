<?php namespace Almacen;
use Symfony\Component\HttpFoundation\Response;

class LineaIntegracion {
	var $pdo;

	public function __construct () {
		$this->pdo = new \PDO('sqlite:db/database.db');
	}

	public function getSuministrosIp () {
		$suministros = array();

		$stm = $this->pdo->query('SELECT nameplate FROM case_ip');
		$caseip = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($caseip) {
			array_push($suministros, $caseip);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		$stm = $this->pdo->query('SELECT nameplate FROM soporte_hp');
		$soportehp = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($soportehp) {
			array_push($suministros, $soportehp);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}		

		$stm = $this->pdo->query('SELECT nameplate FROM escariado');
		$escariado = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($escariado) {
			array_push($suministros, $escariado);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		$stm = $this->pdo->query('SELECT nameplate FROM ngv_lp1');
		$ngvlp1 = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($ngvlp1) {
			array_push($suministros,$ngvlp1);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		$stm = $this->pdo->query('SELECT nameplate FROM ngv_ip');
		$ngvip = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($ngvip) {
			array_push($suministros, $ngvip);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		$stm = $this->pdo->query('SELECT nameplate FROM alabes_ip');
		$alabesip = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($alabesip) {
			array_push($suministros, $alabesip);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		Response::create(json_encode($suministros), Response::HTTP_OK, array('content-type'=>'application/json'))->send();		
	}

	public function getSuministrosLp () {
		$suministros = array();

		$stm = $this->pdo->query('SELECT nameplate FROM eje_lp');
		$caselp = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($caselp) {
			array_push($suministros, $caselp);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}

		$stm = $this->pdo->query('SELECT nameplate FROM tbh');
		$tbh = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($tbh) {
			array_push($suministros, $tbh);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}		

		$stm = $this->pdo->query('SELECT nameplate FROM carcasa_lp');
		$carcasa = $stm->fetch(\PDO::FETCH_ASSOC);
		if ($carcasa) {
			array_push($suministros, $carcasa);
		}
		else {
			array_push($suministros, array('nameplate'=>'no'));
		}
		Response::create(json_encode($suministros), Response::HTTP_OK, array('content-type'=>'application/json'))->send();
	}

    public function addNextEscariado ($nameplate){
        $nameplatemodified = (int)substr($nameplate, -4)+1;
        $newnameplate = 'D5'.$nameplatemodified;
        $now = time();
        try {
            $stm=$this->pdo->prepare("DELETE FROM escariado");
            $stm->execute();
            $this->pdo->query("INSERT into escariado(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
        }
        catch (\PDOException $e){
            echo $e->getMessage();
        }
    }

    public function getNextEscariado () {
        $data = array();
        $stm=$this->pdo->query("SELECT nameplate, time_pedido FROM escariado");
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

    public function addNextCaseIp ($nameplate){
        $nameplatemodified = (int)substr($nameplate, -4)+1;
        $newnameplate = 'D5'.$nameplatemodified;
        $now = time();
        try {
            $stm=$this->pdo->prepare("DELETE FROM case_ip");
            $stm->execute();
            $this->pdo->query("INSERT into case_ip(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
            $this->pdo->query("UPDATE cajas_vacias SET caseip=caseip+1");
            $data=array('error'=> 0);
        }
        catch (\PDOException $e){
            echo $e->getMessage();
        }
    }

    public function addNextSupport ($nameplate){
        $nameplatemodified = (int)substr($nameplate, -4)+1;
        $newnameplate = 'D5'.$nameplatemodified;
        $now = time();
        try {
            $stm=$this->pdo->prepare("DELETE FROM soporte_hp");
            $stm->execute();
            $this->pdo->query("INSERT into soporte_hp(nameplate, time_pedido) VALUES ('$newnameplate', $now)");
            $this->pdo->query("UPDATE cajas_vacias SET soporte=soporte+1");
            $data=array('error'=> 0);
        }
        catch (\PDOException $e){
            echo $e->getMessage();
        }
    }

    public function solicitarEje ($nameplate){
        $now = time();
        if ($stm=$this->pdo->prepare("DELETE FROM eje_lp")) {
            $stm->execute();
        }
            $stm=$this->pdo->prepare("INSERT into eje_lp (nameplate, time_pedido) VALUES (:nameplate, $now)");
        $stm->execute(array(':nameplate'=>$nameplate));

    }

    public function solicitarCarcasa ($nameplate){
        $now = time();
        if ($stm=$this->pdo->prepare("DELETE FROM carcasa_lp")) {
            $stm->execute();
        }
        $stm=$this->pdo->prepare("INSERT into carcasa_lp (nameplate, time_pedido) VALUES (:nameplate, $now)");
        $stm->execute(array(':nameplate'=>$nameplate));

    }

    public function solicitarTbh ($nameplate){
        $now = time();
        if ($stm=$this->pdo->prepare("DELETE FROM tbh")) {
            $stm->execute();
        }
        $stm=$this->pdo->prepare("INSERT into tbh (nameplate, time_pedido) VALUES (:nameplate, $now)");
        $stm->execute(array(':nameplate'=>$nameplate));

    }
}