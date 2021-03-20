export default (ORM = null, Request = null) => {


  return {
    name: "Счета пользователя",
    url: "/cabinet/invoices/",
    icon: "mdi-format-list-checks",
    translate: 'menu.devices',
    /*protected: true,*/
    searchable: false,
    show: {
      add: true,
      edit: false,
      delete: false
    },

    table: {
      sortBy: 'id',
      sortDesc: true,
      per_page: 50,
      slots: [
        {column:'item.number_mobile'},
        {column:'item.status'},
        {column:'item.items'},
        {column:'item.company.title'},
        {column:'item.sum'},
        {column:'item.order.number'},
      ],
      fields: [
        {label: 'Номер', key: 'number'},
        {label: 'Дата', key: 'issued_at'},
        {label: 'Сумма', key: 'sum'},
        {label: 'Оплачен', key: 'payed_at'},
        {label: 'Готов', key: 'ready_at'},
        {label: 'Компания', key: 'company.title'},
        {label: 'Договор', key: 'order.number'},
        {label: 'Состав', key: 'items'},
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