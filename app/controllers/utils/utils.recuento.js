const jwt = require('jsonwebtoken')

const generarId = () => {
  let key = '';
  const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 16; i++) {
    key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return key;
};

const generarId15 = () => {
  let key = '';
  const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 15; i++) {
    key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return key;
};

const getDataToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);
  return tokenDecoded.usuario;
}

const armarQueryAgentesCensales = (juris, datos) => {
  const departamento = datos.cod_depto;
  const provincia = datos.cod_prov;
  const municipio = datos.con_mpio;
  const area = datos.area;
  const zona = datos.zona;

  let whereQuery = '';
  let whereVariable = '';

  switch (juris) {
    case 'Departamento': whereQuery = 'sc.cod_depto=$1'; whereVariable = [departamento]; break;
    case 'Provincia': whereQuery = 'sc.cod_depto=$1 AND sc.cod_prov=$2'; whereVariable = [departamento, provincia]; break;
    case 'Municipio': whereQuery = 'sc.con_mpio=$1'; whereVariable = [municipio]; break;
    case 'Area': whereQuery = 'sc.con_mpio=$1 AND sc.area_cpv=$2';  whereVariable = [municipio, area]; break; 
    case 'Zona': whereQuery = 'sc.con_mpio=$1 AND sc.area_cpv=$2 AND sc.zona=$3'; whereVariable = [municipio, area, zona]; break;
  }

  const query = `SELECT p.id_persona, p.nombres, p.apellido_paterno, p.apellido_materno, 
                 case when p.complemento_ci <> '' then concat(p.cedula_identidad, '-', p.complemento_ci) else p.cedula_identidad end as cedula_identidad, 
                 s.sec_unico, s.con_sec, s.tipo_de_rol
                 FROM asignacion.sector s 
                 INNER JOIN registro.persona p ON p.id_persona = s.id_persona
                 INNER JOIN marco_censal_fdw.vw_sector_censal sc on sc.sec_unico = s.sec_unico
                 WHERE ${whereQuery}`;
  
  return {query, whereVariable};
}

/* ========================================== SAVE DATA ========================================== */
/* =============================================================================================== */

const armarQueryAsignacionSegmento = (id, data) => {
  const datos = {
    id: id,
    id_persona: data.id_persona,
    sec_unico: data.sec_unico,
    con_sec: data.con_sec,
    seg_unico: data.seg_unico,
    con_seg: data.con_seg,
    rol_asignado: data.rol.toUpperCase(),
    id_usuario_registro: data.id_usuario_regisro
  };
  
  const query = `INSERT INTO asignacion.segmento
                 (id, id_persona, sec_unico, con_sec, seg_unico, con_seg, rol_asignado, id_usuario_registro) 
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
  const dataSend = [datos.id, datos.id_persona, datos.sec_unico, datos.con_sec, datos.seg_unico, datos.con_seg, datos.rol_asignado, datos.id_usuario_registro];

  return {query, dataSend};
}

const armarQueryRecuento = (id, data) => {
  const datos = {
    id: generarId(),
    id_asignacion_segmento: id,
    total_viviendas: data.total_viviendas,
    total_personas: data.total_personas,
    total_mujeres: data.total_mujeres,
    total_hombres: data.total_hombres,
    observacion: '',
    id_usuario_registro: data.id_usuario_regisro
  }

  const query = `INSERT INTO recuento.preliminar
                 (id, id_asignacion_segmento, total_viviendas, total_personas, total_mujeres, total_hombres, observacion, id_usuario_registro)
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
  
  const dataSend = [datos.id, datos.id_asignacion_segmento, datos.total_viviendas, datos.total_personas, datos.total_mujeres, datos.total_hombres, datos.observacion,
                    datos.id_usuario_registro];

  return {query, dataSend};
}

module.exports = {
  generarId,
  generarId15,
  getDataToken,
  armarQueryAgentesCensales,
  armarQueryAsignacionSegmento,
  armarQueryRecuento
}