export default (ORM = null, Users = null ) => {

  async function getUsers() {
    let {data} = await Users.methods.all({"role_id":1});
    let users = data.data;
    return users.map(user => ({
      text: user.full_name,
      value: user.id
    }));
  }

  return {
    name: "Уведомления администраторов",
    url: "manage/adminnotifies",
    icon: "mdi-alert-circle-check-outline",
    translate: 'menu.adminnotifies',
    
    searchable: false,

    show: {
      add: true,
      edit: true,
      delete: true
    },
    
    table: {
      // slots:[
      //   {column:'item.mybutton'},
      // ],

      sortBy: 'id',
      sortDesc: true,
      per_page: 10,
      slots: [
        {column:'item.email'},
        {column:'item.sms'},
      ],
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "user.full_name",
          label: "Администратор",
          sortable: false,
        },
        {
          key: "email",
          label: "E-mail"
        },
        {
          key: "sms",
          label: "SMS / PUSH"
        },
      ],
    },
    
    form: async () => ({
      fields: [
        {
          label: 'Администратор',
          type: 'select',
          placeholder: 'Администратор',
          key: 'user_id',
          value: '',
          items: await getUsers(),
          multiple: false,
        },
        {
          label: 'E-mail',
          type: 'switch',
          placeholder: '',
          key: 'email',
          value: '',
        },
        {
          label: 'SMS / PUSH',
          type: 'switch',
          placeholder: '',
          key: 'sms',
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
