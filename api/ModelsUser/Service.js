export default (ORM = null, Request = null) => {

  return {
    name: "Справочник услуг",
    url: "requests/services",
    icon: "mdi-book-open-variant",
    translate: 'menu.service_directory',
    /*protected: true,*/
    searchable: false,
    show: {
      add: false,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: 'id',
      sortDesc: false,
      per_page: 50,
      slots:[
        {column:'item.checkout'},
        {column:'item.device'},
        {column:'item.decree250'},
      ],
      fields: [
        {
          key: "code_si",
          label: "Код СИ",
        },
        {
          key: "title",
          label: "Наименование услуги",
        },
        {
          key: "device_title",
          label: "Средство измерений",
          sortable: false,
        },
        {
          key: "type.title",
          label: "Вид работы",
        },
        {
          key: "dimension.title",
          label: "Ед.",
        },
        {
          key: "checkout",
          label: "Выезд",
        },
        {
          key: "decree250",
          label: "Пост. 250",
        },
        {
          key: "filtered_cost.cost",
          label: "Цена",
        },
      ],
    },
    form: async () => ({
       fields: [
         // {
         //   label: 'Название',
         //   type: 'textField',
         //   placeholder: '',
         //   key: 'name',
         //   value: '',
         // },
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
    }
  };
};