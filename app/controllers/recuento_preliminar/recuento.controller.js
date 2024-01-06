const db = require("../../../config/db");
const db_sirejj = require("../../../config/db_sirejj");
const utils = require("../utils/utils.recuento");
const { Pool } = require("pg");

const db2 = new Pool({
  database: process.env.DB_NAME_TEMP,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

const getDatosSectores = async (req, res) => {
  try {
    const dataToken = utils.getDataToken(req);
    const mcUser = await db_sirejj.query(`
    SELECT u.id_usuario, au.cod_depto, au.con_mpio, au.area, au.zona, au.con_area, au.con_zona, 
    au.con_area_inf, au.con_zona_inf, au.asignado_como, au.tipo
    FROM registro.usuario u left JOIN registro.asignacion_usuario au on u.id_usuario = au.id_usuario
    WHERE u.id_usuario = $1`, [dataToken.id_usuario]);

    const datosSector = await db.query(`
    SELECT id, con_zona, sec_unico, sector
    FROM marco_censal_fdw.vw_sector_censal
    WHERE con_zona_inf = $1
    ORDER BY sec_unico ASC`, [mcUser.rows[0].con_zona_inf]);

    let secUnicoValues = datosSector.rows.map(item => item.sec_unico);

    const datosSegmentos = await db.query(`
    SELECT sec_unico, seg_unico, con_seg, con_sec
    FROM marco_censal_fdw.vw_segmento_censal 
    WHERE sec_unico = ANY($1)`, [secUnicoValues]);

    const datosMC = [
      {
          "disperso_amanzanado": "AMANZANADO",
          "id_departamento": "03",
          "id_municipio": "030701",
          "id_area_censal": "0307010100304",
          "id_zona_censal": "030701010030403",
          "id_comunidad": "01003",
          "estado_asignacion": "ACTIVO"
      }
  ];
  const sectores = [
      {
          "id": 676,
          "con_zona": "030701010030403",
          "sector": "02",
          "sec_unico": "132085"
      },
      {
          "id": 685,
          "con_zona": "030701010030403",
          "sector": "13",
          "sec_unico": "132096"
      },
      {
          "id": 679,
          "con_zona": "030701010030403",
          "sector": "05",
          "sec_unico": "132088"
      },
      {
          "id": 684,
          "con_zona": "030701010030403",
          "sector": "08",
          "sec_unico": "132091"
      },
      {
          "id": 678,
          "con_zona": "030701010030403",
          "sector": "04",
          "sec_unico": "132087"
      },
      {
          "id": 691,
          "con_zona": "030701010030403",
          "sector": "15",
          "sec_unico": "132098"
      },
      {
          "id": 681,
          "con_zona": "030701010030403",
          "sector": "06",
          "sec_unico": "132089"
      },
      {
          "id": 680,
          "con_zona": "030701010030403",
          "sector": "07",
          "sec_unico": "132090"
      },
      {
          "id": 688,
          "con_zona": "030701010030403",
          "sector": "11",
          "sec_unico": "132094"
      },
      {
          "id": 686,
          "con_zona": "030701010030403",
          "sector": "14",
          "sec_unico": "132097"
      },
      {
          "id": 689,
          "con_zona": "030701010030403",
          "sector": "16",
          "sec_unico": "132099"
      },
      {
          "id": 677,
          "con_zona": "030701010030403",
          "sector": "01",
          "sec_unico": "132084"
      },
      {
          "id": 683,
          "con_zona": "030701010030403",
          "sector": "09",
          "sec_unico": "132092"
      },
      {
          "id": 682,
          "con_zona": "030701010030403",
          "sector": "10",
          "sec_unico": "132093"
      },
      {
          "id": 687,
          "con_zona": "030701010030403",
          "sector": "12",
          "sec_unico": "132095"
      },
      {
          "id": 675,
          "con_zona": "030701010030403",
          "sector": "03",
          "sec_unico": "132086"
      }
  ];
  const segmentos = [
      {
          "sec_unico": "132084",
          "seg_unico": "13200391",
          "con_seg": "0307010100304030101",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132084",
          "seg_unico": "13200392",
          "con_seg": "0307010100304030102",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132084",
          "seg_unico": "13200393",
          "con_seg": "0307010100304030103",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132084",
          "seg_unico": "13200394",
          "con_seg": "0307010100304030104",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132084",
          "seg_unico": "13200395",
          "con_seg": "0307010100304030105",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132084",
          "seg_unico": "13200396",
          "con_seg": "0307010100304030106",
          "con_sec": "03070101003040301"
      },
      {
          "sec_unico": "132085",
          "seg_unico": "13200397",
          "con_seg": "0307010100304030201",
          "con_sec": "03070101003040302"
      },
      {
          "sec_unico": "132085",
          "seg_unico": "13200398",
          "con_seg": "0307010100304030202",
          "con_sec": "03070101003040302"
      },
      {
          "sec_unico": "132085",
          "seg_unico": "13200399",
          "con_seg": "0307010100304030203",
          "con_sec": "03070101003040302"
      },
      {
          "sec_unico": "132085",
          "seg_unico": "13200400",
          "con_seg": "0307010100304030204",
          "con_sec": "03070101003040302"
      },
      {
          "sec_unico": "132085",
          "seg_unico": "13200401",
          "con_seg": "0307010100304030205",
          "con_sec": "03070101003040302"
      },
      {
          "sec_unico": "132086",
          "seg_unico": "13200402",
          "con_seg": "0307010100304030301",
          "con_sec": "03070101003040303"
      },
      {
          "sec_unico": "132086",
          "seg_unico": "13200403",
          "con_seg": "0307010100304030302",
          "con_sec": "03070101003040303"
      },
      {
          "sec_unico": "132086",
          "seg_unico": "13200404",
          "con_seg": "0307010100304030303",
          "con_sec": "03070101003040303"
      },
      {
          "sec_unico": "132086",
          "seg_unico": "13200405",
          "con_seg": "0307010100304030304",
          "con_sec": "03070101003040303"
      },
      {
          "sec_unico": "132086",
          "seg_unico": "13200406",
          "con_seg": "0307010100304030305",
          "con_sec": "03070101003040303"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200407",
          "con_seg": "0307010100304030401",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200408",
          "con_seg": "0307010100304030402",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200409",
          "con_seg": "0307010100304030403",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200410",
          "con_seg": "0307010100304030404",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200411",
          "con_seg": "0307010100304030405",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132087",
          "seg_unico": "13200412",
          "con_seg": "0307010100304030406",
          "con_sec": "03070101003040304"
      },
      {
          "sec_unico": "132088",
          "seg_unico": "13200413",
          "con_seg": "0307010100304030501",
          "con_sec": "03070101003040305"
      },
      {
          "sec_unico": "132088",
          "seg_unico": "13200414",
          "con_seg": "0307010100304030502",
          "con_sec": "03070101003040305"
      },
      {
          "sec_unico": "132088",
          "seg_unico": "13200415",
          "con_seg": "0307010100304030503",
          "con_sec": "03070101003040305"
      },
      {
          "sec_unico": "132088",
          "seg_unico": "13200416",
          "con_seg": "0307010100304030504",
          "con_sec": "03070101003040305"
      },
      {
          "sec_unico": "132089",
          "seg_unico": "13200417",
          "con_seg": "0307010100304030601",
          "con_sec": "03070101003040306"
      },
      {
          "sec_unico": "132089",
          "seg_unico": "13200418",
          "con_seg": "0307010100304030602",
          "con_sec": "03070101003040306"
      },
      {
          "sec_unico": "132089",
          "seg_unico": "13200419",
          "con_seg": "0307010100304030603",
          "con_sec": "03070101003040306"
      },
      {
          "sec_unico": "132089",
          "seg_unico": "13200420",
          "con_seg": "0307010100304030604",
          "con_sec": "03070101003040306"
      },
      {
          "sec_unico": "132089",
          "seg_unico": "13200421",
          "con_seg": "0307010100304030605",
          "con_sec": "03070101003040306"
      },
      {
          "sec_unico": "132090",
          "seg_unico": "13200422",
          "con_seg": "0307010100304030701",
          "con_sec": "03070101003040307"
      },
      {
          "sec_unico": "132090",
          "seg_unico": "13200423",
          "con_seg": "0307010100304030702",
          "con_sec": "03070101003040307"
      },
      {
          "sec_unico": "132090",
          "seg_unico": "13200424",
          "con_seg": "0307010100304030703",
          "con_sec": "03070101003040307"
      },
      {
          "sec_unico": "132090",
          "seg_unico": "13200425",
          "con_seg": "0307010100304030704",
          "con_sec": "03070101003040307"
      },
      {
          "sec_unico": "132090",
          "seg_unico": "13200426",
          "con_seg": "0307010100304030705",
          "con_sec": "03070101003040307"
      },
      {
          "sec_unico": "132091",
          "seg_unico": "13200427",
          "con_seg": "0307010100304030801",
          "con_sec": "03070101003040308"
      },
      {
          "sec_unico": "132091",
          "seg_unico": "13200428",
          "con_seg": "0307010100304030802",
          "con_sec": "03070101003040308"
      },
      {
          "sec_unico": "132091",
          "seg_unico": "13200429",
          "con_seg": "0307010100304030803",
          "con_sec": "03070101003040308"
      },
      {
          "sec_unico": "132091",
          "seg_unico": "13200430",
          "con_seg": "0307010100304030804",
          "con_sec": "03070101003040308"
      },
      {
          "sec_unico": "132092",
          "seg_unico": "13200431",
          "con_seg": "0307010100304030901",
          "con_sec": "03070101003040309"
      },
      {
          "sec_unico": "132092",
          "seg_unico": "13200432",
          "con_seg": "0307010100304030902",
          "con_sec": "03070101003040309"
      },
      {
          "sec_unico": "132092",
          "seg_unico": "13200433",
          "con_seg": "0307010100304030903",
          "con_sec": "03070101003040309"
      },
      {
          "sec_unico": "132092",
          "seg_unico": "13200434",
          "con_seg": "0307010100304030904",
          "con_sec": "03070101003040309"
      },
      {
          "sec_unico": "132093",
          "seg_unico": "13200435",
          "con_seg": "0307010100304031001",
          "con_sec": "03070101003040310"
      },
      {
          "sec_unico": "132093",
          "seg_unico": "13200436",
          "con_seg": "0307010100304031002",
          "con_sec": "03070101003040310"
      },
      {
          "sec_unico": "132093",
          "seg_unico": "13200437",
          "con_seg": "0307010100304031003",
          "con_sec": "03070101003040310"
      },
      {
          "sec_unico": "132093",
          "seg_unico": "13200438",
          "con_seg": "0307010100304031004",
          "con_sec": "03070101003040310"
      },
      {
          "sec_unico": "132093",
          "seg_unico": "13200439",
          "con_seg": "0307010100304031005",
          "con_sec": "03070101003040310"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200440",
          "con_seg": "0307010100304031101",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200441",
          "con_seg": "0307010100304031102",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200442",
          "con_seg": "0307010100304031103",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200443",
          "con_seg": "0307010100304031104",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200444",
          "con_seg": "0307010100304031105",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200445",
          "con_seg": "0307010100304031106",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132094",
          "seg_unico": "13200446",
          "con_seg": "0307010100304031107",
          "con_sec": "03070101003040311"
      },
      {
          "sec_unico": "132095",
          "seg_unico": "13200447",
          "con_seg": "0307010100304031201",
          "con_sec": "03070101003040312"
      },
      {
          "sec_unico": "132095",
          "seg_unico": "13200448",
          "con_seg": "0307010100304031202",
          "con_sec": "03070101003040312"
      },
      {
          "sec_unico": "132095",
          "seg_unico": "13200449",
          "con_seg": "0307010100304031203",
          "con_sec": "03070101003040312"
      },
      {
          "sec_unico": "132095",
          "seg_unico": "13200450",
          "con_seg": "0307010100304031204",
          "con_sec": "03070101003040312"
      },
      {
          "sec_unico": "132095",
          "seg_unico": "13200451",
          "con_seg": "0307010100304031205",
          "con_sec": "03070101003040312"
      },
      {
          "sec_unico": "132096",
          "seg_unico": "13200452",
          "con_seg": "0307010100304031301",
          "con_sec": "03070101003040313"
      },
      {
          "sec_unico": "132096",
          "seg_unico": "13200453",
          "con_seg": "0307010100304031302",
          "con_sec": "03070101003040313"
      },
      {
          "sec_unico": "132096",
          "seg_unico": "13200454",
          "con_seg": "0307010100304031303",
          "con_sec": "03070101003040313"
      },
      {
          "sec_unico": "132097",
          "seg_unico": "13200455",
          "con_seg": "0307010100304031401",
          "con_sec": "03070101003040314"
      },
      {
          "sec_unico": "132097",
          "seg_unico": "13200456",
          "con_seg": "0307010100304031402",
          "con_sec": "03070101003040314"
      },
      {
          "sec_unico": "132097",
          "seg_unico": "13200457",
          "con_seg": "0307010100304031403",
          "con_sec": "03070101003040314"
      },
      {
          "sec_unico": "132097",
          "seg_unico": "13200458",
          "con_seg": "0307010100304031404",
          "con_sec": "03070101003040314"
      },
      {
          "sec_unico": "132098",
          "seg_unico": "13200459",
          "con_seg": "0307010100304031501",
          "con_sec": "03070101003040315"
      },
      {
          "sec_unico": "132098",
          "seg_unico": "13200460",
          "con_seg": "0307010100304031502",
          "con_sec": "03070101003040315"
      },
      {
          "sec_unico": "132098",
          "seg_unico": "13200461",
          "con_seg": "0307010100304031503",
          "con_sec": "03070101003040315"
      },
      {
          "sec_unico": "132098",
          "seg_unico": "13200462",
          "con_seg": "0307010100304031504",
          "con_sec": "03070101003040315"
      },
      {
          "sec_unico": "132099",
          "seg_unico": "13200463",
          "con_seg": "0307010100304031601",
          "con_sec": "03070101003040316"
      },
      {
          "sec_unico": "132099",
          "seg_unico": "13200464",
          "con_seg": "0307010100304031602",
          "con_sec": "03070101003040316"
      },
      {
          "sec_unico": "132099",
          "seg_unico": "13200465",
          "con_seg": "0307010100304031603",
          "con_sec": "03070101003040316"
      }
  ];

    res.status(200).json({
      success: true,
      message: "exito",
      data: [datosMC, sectores, segmentos]
    });

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getDatosSectores
}