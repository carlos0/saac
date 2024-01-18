const jwt = require('jsonwebtoken')

const getDataToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);
  return tokenDecoded.usuario;
}

const armarQueryAgentesCensales = (juris, datos) => {
  const departamento = '03';//datos.cod_depto;
  const provincia = '07';//datos.cod_prov;
  const municipio = '030701';//datos.con_mpio;
  const area = '04';//datos.area;
  const zona = '03';//datos.zona;

  let whereQuery = '';
  let whereVariable = '';

  switch (juris) {
    case 'Departamento': whereQuery = 'sc.cod_depto=$1'; whereVariable = [departamento]; break;
    case 'Provincia': whereQuery = 'sc.cod_depto=$1 AND sc.cod_prov=$2'; whereVariable = [departamento, provincia]; break;
    case 'Municipio': whereQuery = 'sc.con_mpio=$1'; whereVariable = [municipio]; break;
    case 'Area': whereQuery = 'sc.con_mpio=$1 AND sc.area_cpv=$2';  whereVariable = [municipio, area]; break; 
    case 'Zona': whereQuery = 'sc.con_mpio=$1 AND sc.area_cpv=$2 AND sc.zona=$3'; whereVariable = [municipio, area, zona]; break;
  }

  const query = `SELECT p.id_persona,p.nombres,p.apellido_paterno,p.apellido_materno,p.cedula_identidad,s.sec_unico,s.con_sec,s.tipo_de_rol
                 FROM asignacion.sector s 
                 LEFT JOIN inscripcion.persona p ON p.id_persona=s.id_persona
                 LEFT JOIN ace.v_sector_censal sc ON sc.sec_unico=s.sec_unico
                 WHERE ${whereQuery}`;
  
  return {query, whereVariable};
}

module.exports = {
  getDataToken,
  armarQueryAgentesCensales
}