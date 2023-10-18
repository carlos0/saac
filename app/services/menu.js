const capacitacion = {
  menu: 'capacitacion',
  url: '/capacitacion/',
  icon: 'icono',
  submenu: [
    {
      menu: 'reclutamiento',
      url: '/reclutamiento',
      icon: 'as',
    },
    {
      menu: 'capacitacion',
      url: '/capacitacion',
      icon: 'as',
    },
  ],
};

const logistica = {
  menu: 'logistica',
  url: '/logistica/',
  icon: 'icono',
  submenu: [
    {
      menu: 'distribucion',
      url: '/reclutamiento',
      icon: 'as',
    },
    {
      menu: 'armado de cajas',
      url: '/capacitacion',
      icon: 'as',
    },
  ],
};

const admin = () => {
  const datos = {
    capacitacion,
    logistica
  }
  return datos;
}

module.exports = {
  capacitacion,
  logistica,
  admin
}
