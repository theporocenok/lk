export default (ORM = null, Request = null) => {

  return {
    name: "Мои СИ",
    url: "/cabinet/devices/",
    icon: "mdi-hammer-screwdriver",
    translate: 'menu.devices',
    /*protected: true,*/
    searchable: false,
    show: {
      add: true,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: 'id',
      sortDesc: false,
      per_page: 50,
      slots: [
        {column:'item.title'},
        {column:'item.company.title'},
        {column:'item.device.grsi'},
        {column:'item.last_calibration'},
      ],
      fields: [
        {
          key: "title",
          label: "Название",
        },
        {
          key: "device.grsi",
          label: "№ ГРСИ",
        },
        {
          key: "serial_number",
          label: "Серийный номер",
        },
        {
          key: "last_calibration",
          label: "Последняя поверка",
        },
        {
          key: "company.title",
          label: "Компания",
        },
      ],
    },
    form: async () => ({
       fields: [
         // {
         //   label: 'Название',
         //   type: 'textField',
         //   placeholder: '',
         //   key: 'name',
         //   value: '',
         // },
       ]
     }),
    
    methods: {
      async all(params) {
        return await ORM.all(params);
      },
      async paginate(options) {
        return await ORM.paginate(options);
      },
      async find(id) {
        return await ORM.find(id);
      },
    }
  };
};