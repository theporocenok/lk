export default (ORM = null, Request = null) => {

  return {
    name: "Роли",
    url: "manage/roles",
    icon: "mdi-account-tie",
    translate: 'menu.roles',
    /*protected: true,*/
    searchable: false,
    consts: {
      admin: 1,
      user: 2,
    },
    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: 'id',
      sortDesc: true,
      per_page: 10,
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "name",
          label: "Название",
        },
      ],
    },
    form: async () => ({
       fields: [
         {
           label: 'Название',
           type: 'textField',
           placeholder: '',
           key: 'name',
           value: '',
         },
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
      async create(data) {
        return await ORM.create(data);
      },
      async update(id, data) {
        return await ORM.update(id, data);
      },
      async delete(id) {
        return await ORM.delete(id);
      }
    }
  };
};