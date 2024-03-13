
const calcularPorcentaje = (datos, totalesCajAC) =>  {
  let cantidadHabilitadoSi = 0;
  let cantidadHabilitadoNo = 0;
  let cantidadHabilitadoNulo = 0;

  let cantidadAbiertoSi = 0;
  let cantidadAbiertoNo = 0;
  let cantidadAbiertoNulo = 0;

  let aCEnCampo = 0;
  let retornoDocCensal = 0;

  for (let i = 0; i < datos.length; i++) {
    // CENTROS OP HABILITADOS
    if (datos[i].centro_op_habilitado == 'SI') {
      cantidadHabilitadoSi++;
    } else if (datos[i].centro_op_habilitado == 'NO') {
      cantidadHabilitadoNo++;
    } else {
      cantidadHabilitadoNulo++;
    }

    // CENTROS OP ABIERTOS
    if (datos[i].centro_op_abierto == 'SI') {
      cantidadAbiertoSi++;
    } else if (datos[i].centro_op_abierto == 'NO') {
      cantidadAbiertoNo++;
    } else {
      cantidadAbiertoNulo++;
    }

    // AGENTES CENSALES EN CAMPO
    if (datos[i].ac_campo_total > 0 || datos[i].ac_campo_total != null) {
      aCEnCampo = aCEnCampo + datos[i].ac_campo_total;
    }

    // RETORNO DE DOCUMENTACIÓN CENSAL
    if (datos[i].retorno_doc_censal_total > 0 || datos[i].retorno_doc_censal_total != null) {
      retornoDocCensal = retornoDocCensal + datos[i].retorno_doc_censal_total;
    }
  }

  
  const datosSend = {
    porcentajeHabilitadoSi: parseFloat((cantidadHabilitadoSi / datos.length) * 100).toFixed(2),
    porcentajeHabilitadoNo: parseFloat((cantidadHabilitadoNo / datos.length) * 100).toFixed(2),
    porcentajeHabilitadoNulo: parseFloat((cantidadHabilitadoNulo / datos.length) * 100).toFixed(2),
    cantidadHabilitadoSi: cantidadHabilitadoSi,
    cantidadHabilitadoNo: cantidadHabilitadoNo,
    cantidadHabilitadoNulo: cantidadHabilitadoNulo,

    porcentajeAbiertoSi: parseFloat((cantidadAbiertoSi / datos.length) * 100).toFixed(2),
    porcentajeAbiertoNo: parseFloat((cantidadAbiertoNo / datos.length) * 100).toFixed(2),
    porcentajeAbiertoNulo: parseFloat((cantidadAbiertoNulo / datos.length) * 100).toFixed(2),
    cantidadAbiertoSi: cantidadAbiertoSi,
    cantidadAbiertoNo: cantidadAbiertoNo,
    cantidadAbiertoNulo: cantidadAbiertoNulo,

    porcentajeACEnCampo: parseFloat((aCEnCampo / totalesCajAC.total_agentes_censales) * 100).toFixed(2),
    aCEnCampo: aCEnCampo,
    total_agentes_censales: totalesCajAC.total_agentes_censales,

    porcentajeRetornoDocCensal: parseFloat((retornoDocCensal / totalesCajAC.total_cajas) * 100).toFixed(2),
    retornoDocCensal: retornoDocCensal,
    total_cajas: totalesCajAC.total_cajas
  }
  return datosSend;

}

module.exports = {
  calcularPorcentaje
}