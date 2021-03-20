export default (ORM = null) => {
  // async function getCompanies(params = {}) {
  //   let send_params = _.assign({}, params, {onlyTitle:true});
  //   let {data} = await Company.methods.all(send_params);
  //   let companies = data.data;
  //   return companies.map(company => ({
  //     text: company.title,
  //     value: company.id
  //   }));
  // }
  // async function getOrders(params = {}) {
  //   let send_params = _.assign({}, params, {onlyTitle:true});
  //   let {data} = await CompanyOrder.methods.all(send_params);
  //   let orders = data.data;
  //   return orders.map(order => ({
  //     text: order.number,
  //     value: order.id
  //   }));
  // }
  function getYears() {
    var years = [];
    for (let i = 1900; i <= new Date().getFullYear(); i++) {
      years.push(i);
    }
    return years;
  }

  
  return {
    name: "Список оборудования компании",
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
          label: 'Наименование',
        },
        {
          key: 'factory_number',
          label: 'Фабричный номер',
        },
        {
          key: 'model',
          label: 'Модель',
        },
        {
          key: 'state_register_number',
          label: 'Серийный номер',
        },
        {
          key: 'release_year',
          label: 'Год выпуска',
        },
        {
          key: '',
          label: 'Адрес',
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
          label: 'ID',
          type: 'textField',
          placeholder: '',
          key: 'id',
          value: '',
        },
        {
          label: 'Адрес',
          type: 'textField',
          placeholder: 'Адрес',
          key: '',
          value: '',
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