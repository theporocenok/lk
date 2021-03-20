export default (ORM = null, Request = null) => {

  return {
    name: "Средства измерений",
    url: "devices/",
    icon: "mdi-hammer-screwdriver",
    translate: 'menu.service_devices',
    /*protected: true,*/
    searchable: false,
    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: 'id',
      sortDesc: false,
      per_page: 50,
      fields: [
        {
          key: "title",
          label: "Название",
        },
        {
          key: "grsi",
          label: "№ ГРСИ",
        },
        {
          key: "description",
          label: "Описание",
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