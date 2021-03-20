export default (ORM = null) => {
  // async function getManagers() {
  //   let {data} = await Users.methods.all({is_manager:1});
  //   let managers = data.data;
  //   return managers.map(mgr => ({
  //     text: mgr.first_name,
  //     value: mgr.id
  //   }));
  // }

  
  return {
    name: "Услуги заявки",
    url: "",
    icon: "mdi-format-list-checks",
    translate: '',
    dialogWidth: '80vw',
    searchable: false,
    show: {
      add: true,
      edit: true,
      delete: true
    },
    
    table: {
      sortBy: 'id',
      sortDesc: false,
      per_page: 10,
      // slots:[
      //   {column:'item.company.title'},
      //   {column:'item.order.number'},
      // ],
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: 'title',
          label: 'Наименование СИ',
        },
        {
          key: "count",
          label: "Количество, шт",
        },
        {
          key: "count_sets",
          label: "Каналов, шт",
        },
        {
          key: "state_register_number",
          label: "Серийный номер",
        },
        {
          key: "release_year",
          label: "Год выпуска",
        },
        {
          key: "fault",
          label: "Разряд, погрешность, КТ",
        },
        {
          key: "measuring_range",
          label: "Предел (диапазон) измерений",
        },
        {
          key: "completeness_info",
          label: "Комплектность/адрес",
        },
      ],
    },
    form: async () => ({

      tabs: [
        {key:'main',title:'Основная информация'},
        {key:'devices',title:'Приборы'},
      ],
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
          tab: 'main',
          label: 'Произвольное наименование услуги',
          type: 'textField',
          placeholder: 'Произвольное наименование услуги',
          key: 'title',
          value: '',
        },
        {
          tab: 'main',
          label: 'Количество, шт',
          type: 'textField',
          placeholder: 'Количество, шт',
          key: 'count',
          value: '',
        },
        {
          tab: 'main',
          label: 'Каналов, шт',
          type: 'textField',
          placeholder: 'Каналов, шт',
          key: 'count_sets',
          value: '',
        },
        {
          tab: 'main',
          label: 'Разряд, погрешность, КТ',
          type: 'textField',
          placeholder: 'Разряд, погрешность, КТ',
          key: 'fault',
          value: '',
        },
        {
          tab: 'main',
          label: 'Предел (диапазон) измерений',
          type: 'textField',
          placeholder: 'Предел (диапазон) измерений',
          key: 'measuring_range',
          value: '',
        },
        {
          tab: 'main',
          label: 'Комплектность',
          type: 'textField',
          placeholder: 'Комплектность',
          key: 'completeness_info',
          value: '',
        },
        {
          tab: 'devices',
          label: 'Приборы',
          type: 'slot',
          key: 'measures',
        }
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