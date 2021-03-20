let makeByModel = model => {
  return {
    name: model.name,
    path: `/${model.url}`,
    icon: model.icon,
    meta: model.meta,
    translate: model.translate,
    submenu : model.submenu ?? []
  };
};

export default ($models) => {
  return [
    {
      name: 'Главная',
      translate: 'menu.main',
      path: '/',
      icon: 'mdi-table',
    },
    {
      "name": "Активации пользователей",
      "path": "/manage/userrequests",
      "icon": "mdi-account-check-outline",
      "translate": "menu.userrequests",
      "submenu": [],
      "right_number": true,
    },
    makeByModel($models.Company),
    makeByModel($models.CompanyOrder),
    makeByModel($models.CompanyInvoice),
    makeByModel($models.User),
    {
      name: 'Заявки на КП',
      translate: 'menu.offer',
      path: '/manage/offers/',
      icon: 'mdi-book',
      submenu: [

      ]
    },
    // makeByModel($models.UserAdminNotify),
    /*makeByModel($models.Role),*/
    makeByModel($models.Mailing),
    {
      name: 'Контакты ЦСМ',
      translate: 'menu.contacts',
      show: false,
      path: '/contacts/',
      icon: 'mdi-map-marker',
    },
    {
      name: 'Настройки',
      translate: 'menu.settings',
      show: false,
      path: '/manage/settings',
      icon: 'mdi-cog',
    },
    {
      name: 'Услуги',
      translate: 'menu.services',
      show: false,
      path: '',
      icon: 'mdi-room-service',
      submenu: [
        {
          name: 'Услуги',
          translate: 'menu.service_directory',
          show: false,
          path: '/services/services/',
          icon: 'mdi-book-open-variant',
          submenu: [
          ],
        },
        {
          name: 'Оборудование',
          translate: 'menu.service_devices',
          show: false,
          path: '/services/devices/',
          icon: 'mdi-hammer-screwdriver',
          submenu: [
          ],
        },
        {
          name: 'Справочники',
          translate: 'menu.directories',
          show: false,
          path: '/services/directories/',
          icon: 'mdi-book-open',
          submenu: [
          ],
        },
      ],
    },
    {
      name: 'Инструкция',
      translate: 'menu.instruction',
      path: null,
      href: '/storage/instructions/instruction.pdf',
      target: '_blank',
      icon: 'mdi-text-box',
      submenu: [],
    },
    {
      name: 'Выход',
      translate: 'menu.signout',
      path: '/auth/logout/',
      icon: 'mdi-logout',
      submenu: [],
    }
    /*{
      name: 'Карта',
      translate: 'menu.map',
      path: '/map',
      icon: 'mdi-map',
      submenu: []
    },*/
  ];
};