<?php
require __DIR__.'/vendor/autoload.php';

$pdo = new \PDO('sqlite:db/database.db');
$stm = $pdo->query('SELECT programador.id, programador.nameplate, materiales.material FROM programador INNER JOIN materiales ON programador.tipos_motor_id_tipo=materiales.tipos_motor_id AND programador.disco_piezas_id_pieza=materiales.piezas_id WHERE programador.suministrado_disco=0');
$stm2 = $pdo->query('SELECT programador.id, programador.nameplate, materiales.material FROM programador INNER JOIN materiales ON programador.tipos_motor_id_tipo=materiales.tipos_motor_id AND programador.alabe_piezas_id_pieza=materiales.piezas_id WHERE programador.suministrado_alabe=0');

//Insertar la lista de materiales de la base de datos en un array
while($discos=$stm->fetch(\PDO::FETCH_ASSOC)) {
 $discosforcheck[]=$discos;
}
while($alabes=$stm2->fetch(\PDO::FETCH_ASSOC)) {
    $alabesforcheck[]=$alabes;
}
$directorio_destino='uploads/';
$destino_completo=$directorio_destino.basename($_FILES["excel-faltantes"]["name"]);
$extension = strtolower(end(explode('.', $_FILES['excel-faltantes']['name'])));
$array=[];
if(in_Array($extension, ['xls', 'xlsx'])) {
	move_uploaded_file($_FILES["excel-faltantes"]["tmp_name"], $destino_completo);
	$tipo = PHPExcel_IOFactory::identify($destino_completo);
	$reader=PHPExcel_IOFactory::createReader($tipo);
	$phpexcel=$reader->load($destino_completo);
	$worksheet=$phpexcel->getSheet(0);
	$max_row= $worksheet->getHighestRow();
	$array_datos= array();
	foreach ($worksheet->getRowIterator() as $row) {
        foreach ($row->getCellIterator() as $cell) {

            if ($cell->getValue() === "Nº Serie Módulo") {
                $columna_serie = $cell->getColumn();
                $row_serie = $cell->getRow();
            }
            if ($cell->getValue() === "Componente") {
                $columna_componente = $cell->getColumn();
                $row_componente = $cell->getRow();
            }
            if (isset($columna_componente) && isset($columna_serie) && isset($row_serie) && isset($row_componente)) {
                break 2;
            }


        }
    }
    $pdo->query('UPDATE programador SET stock_disco=1 WHERE suministrado_disco=0');
	$pdo->query('UPDATE programador SET stock_alabe=1 WHERE suministrado_alabe=0');
    for ($i=$row_serie+1; $i<=$max_row; $i++) {
        foreach ($discosforcheck as $array) {
            if($array['material']==$worksheet->getCell($columna_componente.$i)->getValue() && $array['nameplate']==$worksheet->getCell($columna_serie.$i)->getValue()) {
                $stm=$pdo->query("UPDATE programador SET stock_disco=0 WHERE id=".(int)$array['id']."");
            }
        }
        foreach ($alabesforcheck as $array) {
            if($array['material']==$worksheet->getCell($columna_componente.$i)->getValue() && $array['nameplate']==$worksheet->getCell($columna_serie.$i)->getValue()) {
                $stm=$pdo->query("UPDATE programador SET stock_alabe=0 WHERE id=".(int)$array['id']."");
            }
        }
    }
}	

else {
	echo 'El archivo no es exel';
}
