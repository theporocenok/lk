export default (ORM = null, Users = null) => {
  /*async function getManagers() {
    let {data} = await Users.methods.all({is_manager:1});
    let managers = data.data;
    return managers.map(mgr => ({
      text: mgr.first_name,
      value: mgr.id
    }));
  }*/

  
  return {
    name: "Список компаний",
    url: "manage/companies",
    icon: "mdi-book-multiple",
    translate: 'menu.companies',
    searchable: false,
    show: {
      add: false,
      edit: true,
      delete: false
    },
    
    table: {
      sortBy: 'title',
      sortDesc: false,
      per_page: 10,
      slots: [
        {column:'item.id'},
        {column:'item.title'}
      ],
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "title",
          label: "Название",
        },
        {
          key: 'inn',
          label: 'ИНН',
        },
        {
          key: "kpp",
          label: "КПП",
        },
      ],
    },
    form: async () => ({
      
      fields: [
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
        },
        {
          label: 'Юридический адрес',
          type: 'textField',
          placeholder: '',
          key: 'contact_address',
          value: '',
          disabled:true,
        },
        {
          label: 'Доверенное лицо',
          type: 'textField',
          placeholder: '',
          key: 'delegate',
          value: '',
          disabled:true,
        },
        {
          label: 'Должность доверенного лица',
          type: 'textField',
          placeholder: '',
          key: 'delegate_post',
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
          editor_switch: false,
          editor: true,
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