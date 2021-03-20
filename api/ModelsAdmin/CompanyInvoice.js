export default (ORM = null) => {
  /*async function getManagers() {
    let {data} = await Users.methods.all({is_manager:1});
    let managers = data.data;
    return managers.map(mgr => ({
      text: mgr.first_name,
      value: mgr.id
    }));
  }*/

  
  return {
    name: "Список счетов",
    url: "manage/invoices",
    icon: "mdi-format-list-checks",
    translate: 'menu.invoices',
    searchable: false,
    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: 'id',
      sortDesc: false,
      per_page: 10,
      slots:[
        {column:'item.company.title'},
        {column:'item.order.number'},
      ],
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "issued_at",
          label: "Дата",
        },
        {
          key: 'number',
          label: 'Номер',
        },
        {
          key: 'sum',
          label: 'Сумма',
        },
        {
          key: "company.title",
          label: "Компания",
        },
        {
          key: "order.number",
          label: "Договор",
        },
        {
          key: "payed_at",
          label: "Дата оплаты",
        },
        {
          key: "ready_at",
          label: "Дата готовности",
        },
      ],
    },
    form: async () => ({
      
      fields: [
       /* работать не будет, потому что они в релейшене, надо дописывать чтобы отображалось и на бекенд не уходило
        {
          label: 'Название',
          type: 'textField',
          placeholder: '',
          key: 'title',
          value: '',
          disabled:true,
        },
        {
          label: 'ИНН',
          type: 'textField',
          placeholder: '',
          key: 'inn',
          value: '',
          disabled:true,
        },
        {
          label: 'КПП',
          type: 'textField',
          placeholder: '',
          key: 'kpp',
          value: '',
          disabled:true,
        },*/
        {
          label: 'Дата счета',
          type: 'textField',
          placeholder: '',
          key: 'issued_at',
          value: '',
          disabled:true,
        },
        {
          label: 'Номер счета',
          type: 'textField',
          placeholder: '',
          key: 'number',
          value: '',
          disabled:true,
        },
        {
          label: 'Сумма',
          type: 'textField',
          placeholder: '',
          key: 'sum',
          value: '',
          disabled:true,
        },
        {
          label: 'Дата оплаты',
          type: 'textField',
          placeholder: '',
          key: 'payed_at',
          value: '',
          disabled:true,
        },
        {
          label: 'Дата готовности',
          type: 'textField',
          placeholder: '',
          key: 'ready_at',
          value: '',
          disabled:true,
        },
        {
          label: 'Комментарий',
          type: 'textarea',
          placeholder: '',
          key: 'description',
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