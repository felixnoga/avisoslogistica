<?php
require __DIR__.'/vendor/autoload.php';
use Almacen\Programador;
use Almacen\Almacen;
date_default_timezone_set('Europe/Madrid');
if(isset($_POST['items'])){
	$items = $_POST['items'];
	$ordenar = new Programador();
	$ordenar->ordenar($items);
}

if(isset($_POST['etapa-programador']) && isset($_POST['nameplate-programador']) &&isset($_POST['tipo-programador'])){
	$disco = new Programador();
	$disco->addDiscoAlabes($_POST['etapa-programador'], $_POST['nameplate-programador'], $_POST['tipo-programador']);
	
}

if(isset($_POST['nameplate-programador']) && isset($_POST['todas_etapas']) &&isset($_POST['tipo-programador'])){
	$disco = new Programador();
	$disco->addDiscoAlabes($_POST['todas_etapas'], $_POST['nameplate-programador'], $_POST['tipo-programador']);
	
}

if(isset($_POST['programador_tipos_motor']) && $_POST['programador_tipos_motor']=="pedir") {
	$tipos = new Programador();
	$tipos->getTiposMotor();

}

if (isset($_POST['todos'])){
	$listado = new Programador();
	$listado->showNoSuministrados();
}

if (isset($_POST['nostockalabe'])){
	$id=$_POST['nostockalabe'];
	$alabe = new Programador();
	$alabe->setStockAlabe($id, 0);
}

if (isset($_POST['nostockdisco'])){
	$id=$_POST['nostockdisco'];
	$disco = new Programador();
	$disco->setStockDisco($id, 0);
}

if (isset($_POST['sistockalabes'])){
	$id=$_POST['sistockalabes'];
	$alabe = new Programador();
	$alabe->setStockAlabe($id, 1);
}

if (isset($_POST['sistockdisco'])){
	$id=$_POST['sistockdisco'];
	$disco = new Programador();
	$disco->setStockDisco($id, 1);
}

if (isset($_POST['suministradosProgramador'])){
	$suministrados = new Programador();
	$suministrados->showLastSuministrados();
}

if (isset($_POST['borrarprograma']) && isset($_POST['id'])){
	$borrar = new Programador();
	$borrar->borrarPrograma($_POST['id']);
}

if (isset($_POST['quitarsuministro']) && isset($_POST['id']) &&isset($_POST['parte']) && isset($_POST['eliminarbuffer'])){
	$part = new Programador();
	$disco=new Almacen();
	$part->quitarSuministro($_POST['id'], $_POST['parte']);
	if($_POST['parte']==='disco' && $_POST['eliminarbuffer']==='si'){
		$disco->restarBuffer('disco');
	}	
	if ($_POST['parte']==='alabes' && $_POST['eliminarbuffer']==='si'){
		$disco->restarBuffer('alabes');
	}

}

