let makeByModel = model => {
  return {
    name: model.name,
    path: `/${model.url}`,
    icon: model.icon,
    meta: model.meta,
    translate: model.translate
  };
};

export default () => {
  return [
    {
      name: 'Главная',
      translate: 'menu.main',
      path: '/cabinet/',
      icon: 'mdi-account',
      submenu: []
    },
    {
      name: 'Счета',
      translate: 'menu.cabinet_invoices',
      path: '/cabinet/invoices',
      icon: 'mdi-format-list-checks',
      submenu: [],
      needApproved: true,
    },
    {
      name: 'Договоры',
      translate: 'menu.cabinet_orders',
      path: '/cabinet/orders',
      icon: 'mdi-file-document-edit-outline',
      submenu: [],
      needApproved: true,
    },
    {
      name: 'Компании',
      translate: 'menu.cabinet_companies',
      path: '/cabinet/companies',
      icon: 'mdi-book-multiple',
      submenu: [],
      needApproved: true,
    },
    {
      name: 'Уведомления',
      translate: 'menu.cabinet_events',
      path: '/cabinet/events',
      icon: 'mdi-email',
      submenu: [],
      needApproved: true,
    },
    {
      name: 'Новости',
      translate: 'menu.news',
      show: false,
      path: '/news/',
      icon: 'mdi-newspaper',
      submenu: [
      ],
    },
    {
      name: 'Заявки на КП',
      translate: 'menu.offer',
      path: '/cabinet/offers/',
      icon: 'mdi-book',
      submenu: [

      ]
    },
    {
      name: 'Контакты ЦСМ',
      translate: 'menu.contacts',
      show: false,
      path: '/contacts/',
      icon: 'mdi-map-marker',
      submenu: [
      ],
    },
    {
      name: 'Мои СИ',
      translate: 'menu.devices',
      show: false,
      path: '/cabinet/devices/',
      icon: 'mdi-hammer-screwdriver',
      submenu: [
      ],
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
          name: 'СИ',
          translate: 'menu.service_devices',
          show: false,
          path: '/services/devices/',
          icon: 'mdi-hammer-screwdriver',
          submenu: [
          ],
        },
        // {
        //   name: 'Справочники',
        //   translate: 'menu.directories',
        //   show: false,
        //   path: '/services/directories/',
        //   icon: 'mdi-book-open',
        //   submenu: [
        //   ],
        // },
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
    // {
    //   name: 'Инструкция',
    //   translate: 'menu.instruction',
    //   path: '/storage/instructions/instruction.pdf',
    //   icon: 'mdi-help-circle-outline',
    //   submenu: [
    //   ],
    // },
    /*{
      name: 'Карта',
      translate: 'menu.map',
      path: '/map',
      icon: 'mdi-map',
      submenu: []
    },*/
  ];
};