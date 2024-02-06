const db = require("../../../config/db");
const db_sirejj = require("../../../config/db_sirejj");
const { HttpError } = require("../../helpers/handleError");
const utils = require("../utils/utils.recuento");

const getDatosSectores = async (req, res) => {
  const juridiccion = req.query.juris;
  try {
    const dataToken = utils.getDataToken(req);
    const mcUser = await db_sirejj.query(`
    SELECT u.id_usuario, au.cod_depto, au.cod_prov, au.con_mpio, au.area, au.zona, au.con_area, au.con_zona, 
    au.con_area_inf, au.con_zona_inf, au.asignado_como, au.tipo
    FROM registro.usuario u left JOIN registro.asignacion_usuario au on u.id_usuario = au.id_usuario
    WHERE u.id_usuario = $1`, [dataToken.id_usuario]);

    const datosSector = await db.query(`
    SELECT id, case when tipo = 'A' then 'AMZ' else 'DSP' end as tipo, depto, con_mpio, mpio, cod_cd_com, ciu_com, 
    area_cpv, zona, con_zona, sector, sec_unico, con_sec
    FROM marco_censal_fdw.vw_sector_censal
    WHERE con_zona = $1
    GROUP BY id, tipo, depto, con_mpio, mpio, cod_cd_com, ciu_com, area_cpv, zona, con_zona, sector, sec_unico, con_sec
    ORDER BY sec_unico ASC`, [mcUser.rows[0].con_zona]);

    let secUnicoValues = datosSector.rows.map(item => item.sec_unico);

    const datosSegmentos = await db.query(`
    SELECT sec_unico, seg_unico, con_seg, con_sec
    FROM marco_censal_fdw.vw_segmento_censal 
    WHERE sec_unico = ANY($1)`, [secUnicoValues]);

    
    const datosQueryAC = utils.armarQueryAgentesCensales(juridiccion, mcUser.rows[0]);
    const datosCensista = await db.query(datosQueryAC.query, datosQueryAC.whereVariable);
    console.log('Descargando.....')
    res.status(200).json({
      success: true,
      message: "exito",
      data: [datosSector.rows, datosSegmentos.rows, datosCensista.rows]
    });

  } catch (error) {
    console.log(error);
  }
}

const guardarDatosRecuento = async (req, res) => {
  console.log("🚀 ~ file: recuento.controller.js:guardarDatosRecuento:", req.body)
  const datos = req.body;
  try{
    await db.query('BEGIN');
    const id = utils.generarId15();
    console.log("🚀 ~ guardarDatosRecuento ~ id:", id)
    const segmentoData = utils.armarQueryAsignacionSegmento(id, datos);
    const dataSegmento = await db.query(segmentoData.query, segmentoData.dataSend);
    if (dataSegmento.rows.length > 0) {
      if (datos.total_viviendas != null) {
        const recuentoData = utils.armarQueryRecuento(id, datos);
        const dataRecuento = await db.query(recuentoData.query, recuentoData.dataSend);
        if (dataRecuento.rows.length > 0) {
          await db.query('COMMIT');
          res.status(200).json({
            success: true,
            message: 'Exito.',
            data: []
          })
        }
      } else {
        await db.query('COMMIT');
        res.status(200).json({
          success: true,
          message: 'Exito',
          data: []
        })
      }
    } else {
      new HttpError('Error al guardar la informacion', 400)
    }

  } catch(error) {
    await db.query('ROLLBACK');
    console.log("🚀 error:", error)
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Ocurrio un error.',
      data: []
    })
  }


}

module.exports = {
  getDatosSectores,
  guardarDatosRecuento
}