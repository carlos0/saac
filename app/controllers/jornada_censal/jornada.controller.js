const db_sirejj = require("../../../config/db_sirejj");
//const db = require("../../../config/db");
const db = require("../../../config/db_temp");
const bodyParser = require('body-parser');
const { HttpError } = require("../../helpers/handleError");
const utils = require("../utils/utils.jornada_censal");
const utilsR = require("../utils/utils.recuento");


const obtenerDatosJornada = async (req, res) => {

  const dataToken = utilsR.getDataToken(req);

  try {
    const mcUser = await db_sirejj.query(`
    SELECT u.id_usuario, au.cod_depto, au.cod_prov, au.con_mpio, au.area, au.zona, au.con_area, au.con_zona, 
    au.con_area_inf, au.con_zona_inf, au.asignado_como, au.tipo
    FROM registro.usuario u left JOIN registro.asignacion_usuario au on u.id_usuario = au.id_usuario
    WHERE u.id_usuario = $1`, [dataToken.id_usuario]);

    const datosJornada = await db.query(`
    SELECT con_zona, con_area, area_cpv, zona, sum(total_sectores) as total_sectores, sum(total_segmentos) as total_segmentos, 
    sum(total_sectores+total_segmentos) as total_requerido
    FROM marco_censal_fdw.vw_zona_censal
    WHERE con_zona = $1
    GROUP BY con_zona, con_area, area_cpv, zona`, [mcUser.rows[0].con_zona]);

    const datosUnico = await db.query(`
    SELECT DISTINCT concat(ac.ord_mun, ac.area_cpv,
      CASE
          WHEN ac.tipo = 'A'::text THEN '1'::text
          WHEN ac.tipo = 'D'::text THEN '2'::text
          ELSE NULL::text
      END) AS area_unico,
      CASE
          WHEN zc.zona::text = '00'::text THEN '00'::text
          ELSE concat(mun.ord_mun, substring(zc.cod_cd_com::text, 3), zc.area_cpv, zc.zona,
          CASE
              WHEN ac.tipo = 'A'::text THEN '1'::text
              WHEN ac.tipo = 'D'::text THEN '2'::text
              ELSE NULL::text
          END)
      END AS zona_unico
    FROM marco_censal_fdw.vw_zona_censal zc 
     LEFT JOIN marco_censal_fdw.vw_area_censal ac on zc.con_area = ac.con_area
     LEFT JOIN marco_censal_fdw.vw_municipios mun on zc.con_mpio = mun.con_mpio
    WHERE zc.con_zona = $1`, [mcUser.rows[0].con_zona]);


    const datosParaGuardar = {
      id_usuario: dataToken.id_usuario,
      ac_campo_requerido: datosJornada.rows[0].total_requerido,
      retorno_doc_censal_requerido: datosJornada.rows[0].total_sectores,
      con_zona: datosJornada.rows[0].con_zona,
    };

    const saveRegistro = await db.query(`
    INSERT INTO jornada_censal.registro (id_usuario, ac_campo_requerido, retorno_doc_censal_requerido, con_zona)
          VALUES ($1, $2, $3, $4) RETURNING id_registro`, [datosParaGuardar.id_usuario, datosParaGuardar.ac_campo_requerido, 
            datosParaGuardar.retorno_doc_censal_requerido, datosParaGuardar.con_zona]);
            
    const datos = {
      ...datosJornada.rows[0],
      ...datosUnico.rows[0],
      ...saveRegistro.rows[0]
    }

    res.status(200).json({
      success: true,
      message: 'Exito',
      data: datos
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {}
    })

  }
}


const actualizarRegistro = async (req, res) => {
  const datos = req.body;
  const idRegistro = req.params.id;

  try {

    const updateQuery = Object.keys(datos).map(key => `${key} = '${datos[key]}'`).join(', ');

    const saveData = await db.query(`UPDATE jornada_censal.registro SET ${updateQuery} WHERE id_registro = ${idRegistro} RETURNING id_registro`);
    if (saveData.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Exito',
        data: {}
      })
    } else {
      throw new HttpError("No se pudo actualizar el registro.", 400);
    }
  } catch (error) {
    console.log("🚀 actualizarRegistro:", error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {}
    })
  }
}


const registroDeIncidencias = async (req, res) => {
  const datos = req.body;
  const idRegistro = req.params.id;
  try {
    
    const verifyCreate = await db.query(`SELECT * FROM jornada_censal.incidencias WHERE id_registro = $1 and categoria = $2 and sub_categoria = $3`, 
                                        [idRegistro, datos.categoria, datos.sub_categoria]);
    
    if (verifyCreate.rows.length > 0) {
      // update
      console.log("🚀 Modificando datos",)
      const updateQuery = Object.keys(datos).map(key => `${key} = '${datos[key]}'`).join(', ');
      // hacer FOR
      const saveData = await db.query(`UPDATE jornada_censal.incidencias SET ${updateQuery} WHERE id_registro = ${idRegistro} 
                                       and categoria = '${datos.categoria}'and sub_categoria = '${datos.sub_categoria}' RETURNING id_incidencia`);
      if (saveData.rows.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Exito',
          data: {}
        })
      } else {
        throw new HttpError("No se pudo actualizar el registro.", 400);
      }
    } else {
      //create
      console.log("🚀 Guardando datos",)
      const saveData = await db.query(`INSERT INTO jornada_censal.incidencias (id_registro, categoria, sub_categoria, cantidad, nivel, accion_realizada,
                                       fecha, hora) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_incidencia`,
                       [idRegistro, datos.categoria, datos.sub_categoria, datos.cantidad, datos.nivel, datos.accion_realizada, datos.fecha, datos.hora]);
      if (saveData.rows.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Exito',
          data: {}
        })
      } else {
        throw new HttpError("No se pudo actualizar el registro.", 400);
      }
    }
  } catch (error) {
    console.log("🚀 ~ registroDeIncidencias ~ error:", error)
    console.log("🚀 actualizarRegistro:", error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {}
    })
  }
}


module.exports = {
  obtenerDatosJornada,
  actualizarRegistro,
  registroDeIncidencias
}