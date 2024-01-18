
const _ = require("lodash");
const { verify } = require("jsonwebtoken");
const departamento = require("./departamento.json");

const depto = departamento;
const generarId = () => {
  let key = '';
  const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 16; i++) {
    key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return key;
};
/*  * important : this function is used to build the data */
const buildDatapersona = (data) => {
  console.log(data);
  let id = generarId();
  const dateRecived = data.fecha_nacimiento.split('/');
  const birtdate = new Date(`${dateRecived[2]}-${dateRecived[1]}-${dateRecived[0]}`);
  const ageDifMs = Date.now() - birtdate.getTime(); // change here for validate with 2024-03-22 date
  const age = new Date(ageDifMs).getUTCFullYear() - 1970;
  personaData = {
    id_persona: id,
    cedula_identidad: data.cedula_identidad,
    complemento_ci: data.complemento ? data.complemento : '',
    expedido: data.expedido,
    nombres: data.nombres.toUpperCase(),
    apellido_paterno: data.apellido_paterno ? data.apellido_paterno.toUpperCase() : '',
    apellido_materno: data.apellido_materno ? data.apellido_materno.toUpperCase() : '',
    fecha_nacimiento: data.fecha_nacimiento,
    mayor_edad: age >= 18 ? 'SI' : 'NO',
    edad: age,
    genero: data.genero.toUpperCase(),
    email: data.email ? data.email : '',
    celular: data.celular,
    operadora: data.operadora.toUpperCase(),
    domicilio: data.domicilio.toUpperCase(),
    id_tipo_registro: data.id_tipo_registro,
    detalle_tipo: data.detalle_tipo,
    tiene_seguro_salud: data.tiene_seguro_salud,
    estado_persona: 'REGISTRADO',
    registrado_por: data.id_usuario
  };
  const dataSend = [personaData.id_persona, personaData.cedula_identidad, personaData.complemento_ci, personaData.expedido, personaData.nombres, personaData.apellido_paterno, personaData.apellido_materno,
  personaData.fecha_nacimiento, personaData.mayor_edad, personaData.edad, personaData.genero, personaData.email, personaData.celular, personaData.operadora, personaData.domicilio,
  personaData.id_tipo_registro, personaData.detalle_tipo, personaData.tiene_seguro_salud, personaData.estado_persona, personaData.registrado_por];

  const query = `INSERT INTO registro.persona (id_persona,cedula_identidad, complemento_ci, expedido, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, mayor_edad, edad, 
    genero, email, celular, operadora, domicilio, id_tipo_registro , detalle_tipo, tiene_seguro_salud, estado_persona, registrado_por) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20 ) RETURNING id`;

  return {
    query,
    dataSend,
    id
  }
}

const builDataQuestion = (answer, id_persona) => {
  quetionData = {
    pregunta: "¿A TRAVÉS DE QUÉ MEDIO DE COMUNICACIÓN SE ENTERÓ PARA SER VOLUNTARIO PARA AGENTE CENSAL?",
    respuesta: answer,
    id_persona: id_persona
  }

  const dataSend = [quetionData.pregunta, quetionData.respuesta, quetionData.id_persona];
  const query = `INSERT INTO registro.respuestas (pregunta, respuesta, id_persona) VALUES ($1, $2, $3) RETURNING id_respuesta`;

  return {
    query,
    dataSend
  }
}

const buidlQueryGeo = (latLngData) => {
  if (latLngData != '') {
    let latLng = latLngData.split(',');
    const query = `select vm.cod_depto as id_departamento, concat(vm.cod_depto, vm.cod_prov, vm.cod_mpio) as id_municipio, vm.id as id_utc, geom.point as geom
    from marco_censal_fdw.vw_municipios vm join marco_censal_fdw.municipios_espacial me on me.ord_mun = vm.ord_mun, (SELECT ST_PointFromText('POINT(${latLng[1]} ${latLng[0]})', 4326) as point) as geom
    where ST_Contains(me.geom, geom.point)`;
    return query;
  } else {
    return '';
  }
}

const buidlQueryGeoPoint = (id_departamento) => {
  const point = deptoPointSearch(id_departamento);
  const query = `SELECT ST_PointFromText('POINT(${point})', 4326) as geom`;
  return query;
}

const buildDataRegister = (id_persona, dataLocate, latLng) => {
  let registerData = {
    id_persona,
    geom: dataLocate.geom,
    ubicacion: latLng ? latLng : deptoSearch(dataLocate.id_departamento),
    id_departamento: dataLocate.id_departamento ? dataLocate.id_departamento : '',
    id_municipio: dataLocate.id_municipio ? dataLocate.id_municipio : '',
    id_utc: dataLocate.id_utc ? dataLocate.id_utc : null,
    metodo_registro: 'REGISTRO_MENOR_ASISTIDO_APK',
    estado_registro: 'REGISTRADO'
  }
  let dataSend;
  let query;
  if (latLng != '') {
    dataSend = [registerData.id_persona, registerData.geom, registerData.ubicacion, registerData.id_departamento, registerData.id_municipio,
    registerData.id_utc, registerData.metodo_registro, registerData.estado_registro];

    query = `INSERT INTO registro.registrados (id_persona, geom, ubicacion, id_departamento, id_municipio, id_utc, metodo_registro, estado_registro) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_registro`;
  } else {
    registerData.id_departamental = dataLocate.id_departamento ? dataLocate.id_departamento : '';
    registerData.ubicacion_departamental = deptoSearch(dataLocate.id_departamento);

    dataSend = [registerData.id_persona, registerData.geom, registerData.ubicacion, registerData.id_departamento, registerData.id_municipio,
      registerData.id_utc, registerData.metodo_registro, registerData.estado_registro, registerData.id_departamental, registerData.ubicacion_departamental];

    query = `INSERT INTO registro.registrados (id_persona, geom, ubicacion, id_departamento, id_municipio, id_utc, metodo_registro, estado_registro, id_departamental, ubicacion_departamental) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_registro`;
  }

  return {
    query,
    dataSend
  };

}

const buildDataTutor = (data, id_persona) => {
  const dateRecived = data.tutor.fecha_nacimiento_tutor.split('/');
  const fec_nacimiento_tutor = `${dateRecived[2]}-${dateRecived[1]}-${dateRecived[0]}`;

  const datosTutor = {
    id_persona: id_persona,
    cedula_identidad_tutor: data.tutor.cedula_identidad_tutor,
    complemento_ci_tutor: data.tutor.complemento_tutor ? data.tutor.complemento_tutor : '',
    expedido_tutor: data.tutor.expedido_tutor,
    apellido_paterno_tutor: data.tutor.apellido_paterno_tutor.toUpperCase() ? data.tutor.apellido_paterno_tutor.toUpperCase() : '',
    apellido_materno_tutor: data.tutor.apellido_materno_tutor.toUpperCase() ? data.tutor.apellido_materno_tutor.toUpperCase() : '',
    nombres_tutor: data.tutor.nombres_tutor.toUpperCase(),
    fecha_nacimiento_tutor: fec_nacimiento_tutor,
    email_tutor: data.tutor.email_tutor,
    celular_tutor: data.tutor.celular_tutor,
    estado_persona_tutor: 'REGISTRADO',
  }

  const dataSend = [ datosTutor.id_persona, datosTutor.cedula_identidad_tutor, datosTutor.complemento_ci_tutor, datosTutor.expedido_tutor, datosTutor.apellido_paterno_tutor,
    datosTutor.apellido_materno_tutor, datosTutor.nombres_tutor, datosTutor.fecha_nacimiento_tutor, datosTutor.email_tutor, datosTutor.celular_tutor, datosTutor.estado_persona_tutor ];
    const query = `INSERT INTO registro.tutor(id_persona, cedula_identidad_tutor, complemento_ci_tutor, expedido_tutor, apellido_paterno_tutor, apellido_materno_tutor, nombres_tutor,
                  fecha_nacimiento_tutor, email_tutor, celular_tutor, estado_persona_tutor) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_tutor`;
  return {
    query,
    dataSend
  }

}

const verifyCedula = async (data, db) => {
  const ciMatch = data.map(e => `'${e.cedula_identidad}'`);
  const complementoMatch = data.map(e => `'${e.complemento ? e.complemento : ''}'`);
  const fechaNacimientoMatch = data.map(e => `'${e.fecha_nacimiento}'`);
  const query = `select cedula_identidad  
                 from registro.persona
                 where cedula_identidad in (${ciMatch}) and (complemento_ci in (${complementoMatch}) or fecha_nacimiento  in (${fechaNacimientoMatch}))`;
  console.log("🚀 ~ file: utils.registro.js:115 ~ verifyCedula ~ query:", query)

  const ciVerif = await db.query(query);
  console.log("🚀 ~ file: utils.registro.js:117 ~ verifyCedula ~ ciVerif:", ciVerif)
  if (ciVerif.rowCount == 0) {
    return data;
  } else {
    return ciVerif.rows[0];
  }
}

const deptoSearch = (dataSearh) => {
  let deptoCenter = '';
  for (let i = 0; i < depto.length; i++) {
    if (dataSearh == depto[i].cod_depto) {
      deptoCenter = depto[i].center;
    }
  }
  return deptoCenter;
}

const deptoPointSearch = (dataSearh) => {
  let deptoCenter = '';
  for (let i = 0; i < depto.length; i++) {
    if (dataSearh == depto[i].cod_depto) {
      deptoCenter = depto[i].point;
    }
  }
  return deptoCenter;
}

const deptoNameSearch = (dataSearh) => {
  let deptoName = '';
  for (let i = 0; i < depto.length; i++) {
    if (dataSearh == depto[i].cod_depto) {
      deptoName = depto[i].depto;
    }
  }
  return deptoName;
}


/* *Important  */



module.exports = {
  generarId,
  buildDatapersona,
  builDataQuestion,
  buidlQueryGeo,
  buildDataRegister,
  verifyCedula,
  deptoPointSearch,
  buidlQueryGeoPoint,
  buildDataTutor
};
