export default (ORM = null ) => {
  // async function getSettingGroups() {
  //   let {data} = await SettingGroups.methods.all();
  //   let groups = data.data;
  //   return groups.map(group => ({
  //     text: group.title,
  //     value: group.id
  //   }));
  // }

  return {
    name: "Рассылки",
    url: "manage/mailing/",
    icon: "mdi-email",
    translate: 'menu.mailing',
    searchable: false,
    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      // dense:true,
      sortBy: 'id',
      sortDesc: false,
      per_page: 10,

      slots: [
        {column:'item.type'},
        {column:'item.recipients'},
        {column:'item.text'},
        {column:'item.status'},
      ],

      fields: [
        {
          key: "id",
          label: "#",
          width: 80,
        },
        {
          key: "created_at",
          label: "Создано",
        },
        {
          key: "type",
          label: "Тип",
        },
        {
          key: "recipients",
          label: "Получатели",
        },
        {
          key: "title",
          label: "Название",
        },
        {
          key: "text",
          label: "Текст",
        },
        {
          key: "cost",
          label: "Стоимость",
        },
        {
          key: "status",
          label: "Статус",
        },
      ],
    },
    form: async () => ({
      
      fields: [
        // {
        //   label: 'Группа',
        //   type: 'select',
        //   placeholder: 'Группа',
        //   key: 'setting_group_id',
        //   value: '1',
        //   items: await getSettingGroups(),
        //   multiple: false,
        //   disabled: false,
        // },
        {
          label: 'Название',
          type: 'textField',
          placeholder: '',
          key: 'title',
          value: '',
        },
        {
          label: 'Ключ',
          type: 'textField',
          placeholder: '',
          key: 'name',
          value: '',
        },
        {
          label: 'Значение',
          type: 'textarea',
          editor:false,
          placeholder: '',
          key: 'value',
          value: '',
        },
        {
          label: 'Прикрепленные файлы',
          type: 'file',
          placeholder: '',
          key: 'files',
          multiple:true,
          value: [],
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