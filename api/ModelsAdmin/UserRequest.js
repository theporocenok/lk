export default (ORM = null) => {
  

  return {
    name: "Активации пользователей",
    url: "manage/userrequests",
    icon: "mdi-account-check-outline",
    translate: 'menu.userrequests',
    
    searchable: false,

    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      // slots:[
      //   {column:'item.image.url'},
      // ],

      sortBy: 'created_at',
      sortDesc: true,
      per_page: 10,

      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "created_at",
          label: "Дата"
        },
        {
          key: "user.full_name",
          label: "Фио",
        },
        {
          key: "company.title",
          label: "Компания"
        },
        // {
        //   key: "image.url",
        //   label: "Файл"
        // },
        // {
        //   key: "mybutton",
        //   label: "Действия",
        //   sortable: false,
        // },
      ],
    },
    
    form: async () => ({
      fields: [
        {
          label: 'Дата',
          type: 'textField',
          placeholder: '',
          key: 'button',
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
      },
    }
  };
}
