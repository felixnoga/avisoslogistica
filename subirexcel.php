<?php
require __DIR__.'/vendor/autoload.php';

$t700pattern="/T700/i";

$pdo = new \PDO('sqlite:db/database.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
	$t700_columna_modulo_pattern = "/MODULE/i";
	$resto_columna_modulo_pattern = "/(N|Nº) serie m(o|ó)dulo/i";
	$t700_columna_material_pattern = "/PART NUMBER/i";
	$resto_columna_material_pattern = "/Componente/i";


    if (preg_match($t700pattern, basename($_FILES["excel-faltantes"]["name"]))) {
		foreach ($worksheet->getRowIterator() as $row) {
	        foreach ($row->getCellIterator() as $cell) {

	            if (preg_match($t700_columna_modulo_pattern, $cell->getValue()) ) {
	                $columna_serie = $cell->getColumn();
	                $row_serie = $cell->getRow();
	            }
	            if (preg_match($t700_columna_material_pattern, $cell->getValue()) ) {
	                $columna_componente = $cell->getColumn();
	                $row_componente = $cell->getRow();
	            }
	            if (isset($columna_componente) && isset($columna_serie) && isset($row_serie) && isset($row_componente)) {
	                break 2;
	            }
	        }
	    }



		$pdo->query('UPDATE programador SET stock_disco=1 WHERE suministrado_disco=0 AND tipos_motor_id_tipo=1');
		$pdo->query('UPDATE programador SET stock_alabe=1 WHERE suministrado_alabe=0 AND tipos_motor_id_tipo=1');
		$fecha = date('d/M/Y H:i');
	    $pdo->query("UPDATE fecha_archivo SET fecha_t700='$fecha'");

		for ($i=$row_serie+1; $i<=$max_row; $i++) {
			if (preg_match("/D[H8]/i", $worksheet->getCell($columna_serie.$i)->getValue())) {
				if (preg_match("/D8/i", $worksheet->getCell($columna_serie.$i)->getValue())) {
					$seriemodulo=preg_replace("/D8/i", "DH", $worksheet->getCell($columna_serie.$i)->getValue());
				}
				else if (preg_match("/DH/i", $worksheet->getCell($columna_serie.$i)->getValue())) {
					$seriemodulo = $worksheet->getCell($columna_serie.$i)->getValue();
				}
			}
			if ($worksheet->getCell($columna_componente.$i)->getValue()!=='' || $worksheet->getCell($columna_componente.$i).getValue()!==NULL) {
		        foreach ($discosforcheck as $array) {
		            if($array['material']==$worksheet->getCell($columna_componente.$i)->getValue() && $array['nameplate']==$seriemodulo) {
		                $stm=$pdo->query("UPDATE programador SET stock_disco=0 WHERE id=".(int)$array['id']."");
		            }
		        }
    	        foreach ($alabesforcheck as $array) {
		            if($array['material']==$worksheet->getCell($columna_componente.$i)->getValue() && $array['nameplate']==$seriemodulo) {
                        $worksheet->getCell($columna_componente.$i)->getValue();
		                $stm=$pdo->query("UPDATE programador SET stock_alabe=0 WHERE id=".(int)$array['id']."");
		            }
	       		}				
			}
		}
        $files = glob('uploads/*'); // get all file names
        foreach($files as $file){ // iterate files
            if(is_file($file))
                unlink($file); // delete file
        }
    }

    else {

		foreach ($worksheet->getRowIterator() as $row) {
	        foreach ($row->getCellIterator() as $cell) {

	            if (preg_match($resto_columna_modulo_pattern, $cell->getValue())) {
	                $columna_serie = $cell->getColumn();
	                $row_serie = $cell->getRow();
	            }
	            if (preg_match($resto_columna_material_pattern, $cell->getValue())) {
	                $columna_componente = $cell->getColumn();
	                $row_componente = $cell->getRow();
	            }
	            if (isset($columna_componente) && isset($columna_serie) && isset($row_serie) && isset($row_componente)) {
	            	                echo $columna_serie;
	                echo $row_serie;
	                echo $columna_componente;
	                echo $row_componente;
	                break 2;

	            }


	        }
	    }    	

	    $pdo->query('UPDATE programador SET stock_disco=1 WHERE suministrado_disco=0 AND tipos_motor_id_tipo!=1');
		$pdo->query('UPDATE programador SET stock_alabe=1 WHERE suministrado_alabe=0 AND tipos_motor_id_tipo!=1');
        $fecha = date('d/M/Y H:i');
        $pdo->query("UPDATE fecha_archivo SET fecha='$fecha'");

        for ($i=$row_serie+1; $i<=$max_row; $i++) {
	        foreach ($discosforcheck as $array) {
	            if($array['material']==trim($worksheet->getCell($columna_componente.$i)->getValue()) && $array['nameplate']==trim($worksheet->getCell($columna_serie.$i)->getValue())) {
	                $stm=$pdo->query("UPDATE programador SET stock_disco=0 WHERE id=".(int)$array['id']."");
	            }
	        }
	        foreach ($alabesforcheck as $array) {
	            if($array['material']==trim($worksheet->getCell($columna_componente.$i)->getValue()) && $array['nameplate']==trim($worksheet->getCell($columna_serie.$i)->getValue())) {
	                $stm=$pdo->query("UPDATE programador SET stock_alabe=0 WHERE id=".(int)$array['id']."");
	            }
	        }
	    }    	
    }
}	

else {
	echo 'El archivo no es excel';
}
