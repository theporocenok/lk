export default (ORM = null, SettingGroup = null) => {
  async function getSettingGroups() {
    let {data} = await SettingGroup.methods.all();
    let groups = data.data;
    return groups.map(group => ({
      text: group.title,
      value: group.id
    }));
  }

  return {
    name: "Настройки",
    url: "manage/settings/",
    icon: "mdi-cogs",
    translate: 'menu.settings',
    searchable: false,
    show: {
      add: true,
      edit: true,
      delete: true
    },
    
    table: {
      // dense:true,
      sortBy: 'title',
      sortDesc: false,
      per_page: 10,

      slots: [
        {column:'item.value'}
      ],

      fields: [
        {
          key: "id",
          label: "#",
          width: 80,
        },
        {
          key: "title",
          label: "Название",
        },
        {
          key: "name",
          label: "Ключ",
        },
        {
          key: "value",
          label: "Значение",
        },
      ],
    },
    form: async () => ({
      
      fields: [
        {
          label: 'Группа',
          type: 'select',
          placeholder: 'Группа',
          key: 'setting_group_id',
          value: '1',
          items: await getSettingGroups(),
          multiple: false,
          disabled: false,
        },
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