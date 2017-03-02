<?php
require __DIR__.'/vendor/autoload.php';
//require 'src/Almacen.php';///QUITAR CUANDO MODIFIQUEMOS AUTOLOAD OTRA VEZ
use Almacen\Almacen;
use Almacen\LineaIntegracion;
date_default_timezone_set('Europe/Madrid');
setlocale(LC_ALL,"es_ES");

if(isset($_POST['alldiscos'])){
	
	$discos = new Almacen();
	$discos->showDiscosNoSuministrados();
}

if(isset($_POST['alldiscossincarretilla'])){
	
	$discos = new Almacen();
	$discos->showDiscosNoSuministradosSinCarretilla();
}

if(isset($_POST['allalabes'])){
	
	$alabes = new Almacen();
	$alabes->showAlabesNoSuministrados();
}

if(isset($_POST['allalabessincarretilla'])){
	
	$alabes = new Almacen();
	$alabes->showAlabesNoSuministradosSinCarretilla();
}

if(isset($_POST['suministraralabe'])){
	$id=$_POST['id'];
	$alabes = new Almacen();
	$alabes->suministrarAlabe($id);
}

if(isset($_POST['suministrardisco'])){
	$id=$_POST['id'];
	$nameplate=$_POST['nameplate'];
	$etapa=$_POST['etapa'];
	$disco = new Almacen();
	$disco->suministrarDisco($id, $nameplate, $etapa);
}

if(isset($_POST['bufferdiscos'])){
	$bufferdiscos = new Almacen();
	$bufferdiscos->getBufferDiscos();
}

if(isset($_POST['bufferalabes'])){
	$bufferalabes = new Almacen();
	$bufferalabes->getBufferAlabes();
}

if(isset($_POST['consumirAlabe'])){
	$alabes = new Almacen();
	if ($_POST['curvicos']=="no"){
		 $alabes->restarBuffer('alabes');
	}
	else {
		$alabes->restarBuffer('alabescurvico');
	}	
	$alabes->setCajasVacias('alabes', 1);
}

if(isset($_POST['consumirNgvLp1']) && isset($_POST['nameplate'])){
	$nameplate=$_POST['nameplate'];
	$ngv = new Almacen();
	$ngv->addNextNgvLp1($nameplate);

}

if(isset($_POST['consumircaseip']) && isset($_POST['nameplate'])){
    $nameplate=$_POST['nameplate'];
    $ngv = new Almacen();
    $ngv->addNextCaseIp($nameplate);

}

if(isset($_POST['consumirsoporte']) && isset($_POST['nameplate'])){
    $nameplate=$_POST['nameplate'];
    $ngv = new Almacen();
    $ngv->addNextSoporte($nameplate);

}

if(isset($_POST['consumirNgvIp']) && isset($_POST['nameplate'])){
	$nameplate=$_POST['nameplate'];
	$ngv = new Almacen();
	$ngv->addNextNgvIp($nameplate);

}

if(isset($_POST['consumirAlabeIp']) && isset($_POST['nameplate'])){
	$nameplate=$_POST['nameplate'];
	$alabe = new Almacen();
	$alabe->addNextBladeIp($nameplate);

}

if(isset($_POST['getvaciasdiscos'])){
	$vaciasDiscos = new Almacen();
	$vaciasDiscos->getCajasVacias('discos');
}

if(isset($_POST['getvaciasalabes'])){
	$vaciasAlabes = new Almacen();
	$vaciasAlabes->getCajasVacias('alabes');
}

if(isset($_POST['allngvs'])){
	$ngvs = new Almacen();
	$ngvs->getNgvs();
}

if(isset($_POST['allngvssincarretilla'])){
	$ngvs = new Almacen();
	$ngvs->getNgvsSinCarretilla();
}

if(isset($_POST['suministrarngv']) && isset($_POST['id'])){
	$id = $_POST['id'];
	$ngvs = new Almacen();
	$ngvs->suministrarNgvs($id);
}

if(isset($_POST['bufferngvs'])){
	$bufferngvs = new Almacen();
	$bufferngvs->getBufferNgvs();
}

if(isset($_POST['getvaciasngvs'])){
	$ngvs = new Almacen();
	$ngvs->getCajasVacias('ngv');
}

if(isset($_POST['limpiarvaciasngvs'])){
	$ngvs = new Almacen();
	$ngvs->setCajasVacias('ngv', 0);
}

if(isset($_POST['limpiarvaciasalabes'])){
	$alabes = new Almacen();
	$alabes->setCajasVacias('alabes', 0);
}

if(isset($_POST['limpiarvaciasdiscos'])){
	$discos = new Almacen();
	$discos->setCajasVacias('discos', 0);
}

if(isset($_POST['loadEscariado'])){
	$escariado = new Almacen();
	$escariado->getNextEscariado();
}

if(isset($_POST['loadCaseIp'])){
	$case = new Almacen();
	$case->getNextCaseIp();
}

if(isset($_POST['loadSupport'])){
	$support = new Almacen();
	$support->getNextSupport();
}

if(isset($_POST['loadNgvLp1'])){
	$ngv = new Almacen();
	$ngv->getNextNgvLp1();
}

if(isset($_POST['loadNgvIp'])){
	$ngv = new Almacen();
	$ngv->getNextNgvIp();
}

if(isset($_POST['loadBladeIp'])){
	$blade = new Almacen();
	$blade->getNextBladeIp();
}

if(isset($_POST['suministrarEscariado'])){
	$escariado = new Almacen();
	$escariado->suministrarEscariado();
}

if(isset($_POST['suministrarSupport'])){
	$support = new Almacen();
	$support->suministrarSupport();
}

if(isset($_POST['suministrarCase'])){
	$case = new Almacen();
	$case->suministrarCase();
}

if(isset($_POST['suministrarNgvLp1'])){
	$ngv = new Almacen();
	$ngv->suministrarNgvLp1();
}

if(isset($_POST['suministrarNgvIp'])){
	$ngv = new Almacen();
	$ngv->suministrarNgvIp();
}

if(isset($_POST['suministrarBladeIp'])){
	$blade = new Almacen();
	$blade->suministrarBladeIp();
}

if(isset($_POST['limpiar'])){
	$part = new Almacen();
	if ($_POST['limpiar']=='alabeip'){
		$tipo = 'alabesip';
	}
	else if ($_POST['limpiar']=='support'){
		$tipo = 'soporte';
	}	
	else {
		$tipo=$_POST['limpiar'];
	}
	$part->setCajasVacias($tipo, 0);
}

if(isset($_POST['deshacerdisco'])) {
	$disco=new Almacen();
	$disco->deshacerSuministroDisco();
}

if(isset($_POST['deshaceralabes'])) {
	$alabes=new Almacen();
	$alabes->deshacerSuministroAlabes();
}

if(isset($_POST['removedisco']) && isset($_POST['id'])) {
	$buffer=new Almacen();
	$buffer->restarBufferDiscoAlmacen($_POST['id']);
}

if(isset($_POST['removealabes']) && $_POST['removealabes']==1) {
	$buffer=new Almacen();
	$buffer->restarBufferAlabes($_POST['id']);
}

if(isset($_POST['removengv']) && $_POST['removengv']==1) {
	$buffer=new Almacen();
	 $buffer->restarBufferNgv($_POST['id']);
}

if (isset($_POST['getsuministroslineaip'])) {
	$suministrosip = new LineaIntegracion ();
	$suministrosip->getSuministrosIp();
}

if (isset($_POST['getsuministroslinealp'])) {
	$suministrosLp = new LineaIntegracion ();
	$suministrosLp->getSuministrosLp();
}

if (isset($_POST['discosparaconsumir'])) {
    $discos= new Almacen();
    $discos->getBufferDiscos();
}

if (isset($_POST['alabesparaconsumir'])) {
    $discos= new Almacen();
    $discos->getBufferAlabes();
}
if (isset($_POST['quitarbuffer'])) {
    $alabes= new Almacen();
    $alabes->restarBufferDiscoMontaje($_POST['id']);
    $alabes->getBufferDiscos();
}

if (isset($_POST['quitarbufferalabes'])) {
    $discos= new Almacen();
    $discos->restarBufferAlabes($_POST['id']);
    $discos->getBufferAlabes();
}

if (isset($_POST['ngvsparaconsumir'])) {
    $discos= new Almacen();
    $discos->getBufferNgvs();
}

if (isset($_POST['quitarbufferngvs'])) {
    $ngv= new Almacen();
    $ngv->restarBufferNgv($_POST['id']);
    $ngv->getBufferNgvs();
}

if (isset($_POST['quitarbufferysuministro']) && isset($_POST['nameplate']) && isset($_POST['etapa'])) {
    $discos= new Almacen();
    $discos->suministrarDiscoDesdeMontaje($_POST['nameplate'], $_POST['etapa']);

}

if (isset($_POST['quitarbufferysuministroalabes']) && isset($_POST['nameplate']) && isset($_POST['etapa'])) {
    $discos= new Almacen();
    $discos->restarBufferAlabesSinSuministrar($_POST['nameplate'], $_POST['etapa']);
}

if (isset($_POST['quitarbufferysuministrongvs']) && isset($_POST['nameplate']) && isset($_POST['etapa'])) {
    $ngv= new Almacen();
    $ngv->restarBufferNgvsSinSuministrar($_POST['nameplate'], $_POST['etapa']);
}

if (isset($_POST['solicitareje']) && isset($_POST['nameplate'])) {
    $eje= new LineaIntegracion();
    $eje->solicitarEje($_POST['nameplate']);
}

if (isset($_POST['solicitarcarcasa']) && isset($_POST['nameplate'])) {
    $c= new LineaIntegracion();
    $c->solicitarCarcasa($_POST['nameplate']);
}

if (isset($_POST['solicitartbh']) && isset($_POST['nameplate'])) {
    $tbh= new LineaIntegracion();
    $tbh->solicitarTbh($_POST['nameplate']);
}

if (isset($_POST['suministrarlineaip']) && isset($_POST['parte'])) {
    $ip = new Almacen();
    switch ($_POST['parte']) {
        case 'case_ip':
            $ip->suministrarCaseIp();
            break;
        case 'soporte':
            $ip->suministrarSoporte();
            break;
        case 'escariado':
            $ip->suministrarEscariado();
            break;
        case 'ngv_lp1':
            $ip->suministrarNgvLp1();
            break;
        case 'ngv_ip':
            $ip->suministrarNgvIp();
            break;
        case 'alabes_ip':
            $ip->suministrarBladeIp();
            break;
    }

}

if (isset($_POST['suministrarlinealp']) && isset($_POST['parte'])) {
    $lp = new Almacen();
    switch ($_POST['parte']) {
        case 'case_lp':
            $lp->suministrarCaseLp();
            break;
        case 'tbh':
            $lp->suministrarTbh();
            break;
        case 'eje_lp':
            $lp->suministrarEjeLp();
            break;
    }

}

if (isset($_POST['checkbufferqty'])) {
	$qty=new Almacen();
	$qty->checkBufferQty();
}




