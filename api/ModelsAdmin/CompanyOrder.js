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
    name: "Список договоров",
    url: "manage/orders",
    icon: "mdi-file-document-edit-outline",
    translate: 'menu.orders',
    searchable: false,
    show: {
      add: false,
      edit: true,
      delete: false
    },
    
    table: {
      sortBy: 'company.title',
      sortDesc: false,
      per_page: 10,
      slots:[
        {column:'item.company.title'},
      ],
      fields: [
        {
          key: "company.title",
          label: "Компания",
        },
        {
          key: 'number',
          label: 'Номер',
        },
        {
          key: "approved_at",
          label: "Подписан",
        },
        {
          key: "valid_to",
          label: "Действует до",
        },
      ],
    },
    form: async () => ({
      
      fields: [
       /* работать не будет, потому что они в релейшене, надо дописывать чтобы отображалось и на бекенд не уходило
        {
          label: 'Название компании',
          type: 'textField',
          placeholder: '',
          key: 'company.title',
          value: '',
          disabled:true,
        },
        {
          label: 'ИНН',
          type: 'textField',
          placeholder: '',
          key: 'company.inn',
          value: '',
          disabled:true,
        },
        {
          label: 'КПП',
          type: 'textField',
          placeholder: '',
          key: 'company.kpp',
          value: '',
          disabled:true,
        },*/
        {
          label: 'Номер договора',
          type: 'textField',
          placeholder: '',
          key: 'number',
          value: '',
          disabled:true,
        },
        {
          label: 'Дата подписания',
          type: 'textField',
          placeholder: '',
          key: 'approved_at',
          value: '',
          disabled:true,
        },
        {
          label: 'Действует до',
          type: 'textField',
          placeholder: '',
          key: 'valid_to',
          value: '',
          disabled:true,
        },
        /*{
          label: 'Рабочий номер',
          type: 'textField',
          placeholder: '',
          key: 'contact_phone_work',
          value: '',
        },
        {
          label: 'Мобильный номер',
          type: 'textField',
          placeholder: '',
          key: 'contact_phone_mobile',
          value: '',
        },*/
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