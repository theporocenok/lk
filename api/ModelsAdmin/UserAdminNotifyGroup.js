export default (ORM = null) => {
  
  return {
    name: "Уведомления",
    url: "manage/settings/",
    icon: "mdi-account-tie",
    translate: 'menu.notifies',
    
    searchable: false,
    
    show: {
      add: true,
      edit: true,
      delete: true
    },
    
    table: {
      // slots: [
      //   {column:'item.enabled'},
      //   {column:'item.contacts'},
      // ],
      sortBy: 'id',
      sortDesc: true,
      
      fields: [
        {
          key: "id",
          label: "#"
        },
        // {
        //   key: "enabled",
        //   label: "Активен"
        // },
        // {
        //   key: "full_name",
        //   label: "ФИО"
        // },
        // {
        //   key: "post",
        //   label: "Должность"
        // },
        // {
        //   key: "contacts",
        //   label: "Контакты",
        //   sortable: false
        // },
        // {
        //   key: "country",
        //   label: "Страна"
        // },
        // {
        //   key: "city",
        //   label: "Город"
        // },
        // {
        //   key: "language.name",
        //   label: "Язык"
        // },
        // {
        //   key: "phone",
        //   label: "Телефон"
        // },
        // {
        //   key: "role.name",
        //   label: "Роль"
        // },
      ],
    },
    
    form: async () => ({
      fields: [
        {
          label: 'Пользователь активен',
          type: 'switch',
          placeholder: '',
          key: 'enabled',
          value: '',
        },
        {
          label: 'Фамилия',
          type: 'textField',
          placeholder: '',
          key: 'last_name',
          value: '',
        },
        {
          label: 'Имя',
          type: 'textField',
          placeholder: '',
          key: 'first_name',
          value: '',
        },
        {
          label: 'Отчество',
          type: 'textField',
          placeholder: '',
          key: 'patronymic_name',
          value: '',
        },
        {
          label: 'Email',
          type: 'textField',
          placeholder: 'Email',
          key: 'email',
          value: '',
        },
        {
          label: 'Пароль',
          type: 'textField',
          placeholder: 'Пароль',
          key: 'password',
          value: '',
        },
        {
          label: 'Страна',
          type: 'textField',
          placeholder: '',
          key: 'country',
          value: '',
        },
        {
          label: 'Город',
          type: 'textField',
          placeholder: '',
          key: 'city',
          value: '',
        },
        {
          label: 'Телефон',
          type: 'textField',
          placeholder: '',
          key: 'phone',
          mask: '+7 (###) ###-##-##',
          rules: [v => (!!v && v.length == 18 || !!!v) || 'Номер телефона должен содержать 11 цифр'],
          validateLength: 18,
          value: '',
        },
        {
          label: 'Роль',
          type: 'select',
          placeholder: 'Роль',
          key: 'role_id',
          value: Role.consts.user,
          items: await getRoles(),
          multiple: false,
          disabled: false,
        },
        {
          label: 'Должность',
          type: 'textField',
          placeholder: '',
          key: 'post',
          value: '',
        },
        {
          label: 'Подпись',
          label_tootlip: 'Необходимо загрузить изображение, размером (ШхВ) 4х3 см в формате SVG, либо PNG с прозрачным фоном.',
          label_icon: 'mdi-help-circle',
          type: 'file',
          placeholder: '',
          key: 'sign',
          value: [],
        },
        /*{
         label: 'Язык',
         type: 'select',
         placeholder: 'Язык',
         key: 'language_id',
         items: await getLanuages(),
         multiple: false,
         disabled: false,
         },*/
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
