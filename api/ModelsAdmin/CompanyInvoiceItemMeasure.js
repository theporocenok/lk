export default (ORM = null, CompanyMeasure = null) => {
  async function getMeasures(params = {}) {
    let send_params = _.assign({}, params, {onlyTitle:true});
    let {data} = await CompanyMeasure.methods.all(send_params);
    let measures = data.data;
    return measures.map(measure => ({
      text: measure.title,
      value: measure.id
    }));
  }
  // async function getOrders(params = {}) {
  //   let send_params = _.assign({}, params, {onlyTitle:true});
  //   let {data} = await CompanyOrder.methods.all(send_params);
  //   let orders = data.data;
  //   return orders.map(order => ({
  //     text: order.number,
  //     value: order.id
  //   }));
  // }
  // function getYears() {
  //   var years = [];
  //   for (let i = 1900; i <= new Date().getFullYear(); i++) {
  //     years.push(i);
  //   }
  //   return years;
  // }

  
  return {
    name: "Список оборудования услуги",
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
      slots:[
        // {column:'item.company_measure.title'},
        // {column:'item.order.number'},
      ],
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: 'company_measure.title',
          label: 'Наименование',
        },
        {
          key: 'company_measure.factory_number',
          label: 'Фабричный номер',
        },
        {
          key: 'company_measure.model',
          label: 'Модель',
        },
        {
          key: 'company_measure.state_register_number',
          label: 'Серийный номер',
        },
        {
          key: 'company_measure.release_year',
          label: 'Год выпуска',
        },
        {
          key: 'company_measure.address',
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
          label: 'Средство измерений',
          type: 'autocomplete',
          placeholder: '',
          key: 'company_measure_id',
          value: '',
          items: async ( editedItem ) => {
            // подгружаем только выбранный элемент
            let measure = editedItem.find((item) => item.key === 'company_measure_id');
            return await getMeasures({searchId:measure.value});
          },
          onKeyUp: async (form, field) => {
            // ищем по совпадению
            if(!field.search_input || field.search_input.length<3) return;
            // let company = form.find((item) => item.key === 'company_id');
            let measure = form.find((item) => item.key === 'company_measure_id');
            measure.items = await getMeasures({searchText:field.search_input, /*filter_company_id: company.value*/});
          },
          onChange: async (form, field) => {
            let measure = form.find((item) => item.key === 'company_measure_id');
            measure.items = await getMeasures({companyId:field.value});
          },
        },
        {
          label: 'Адрес',
          type: 'textField',
          placeholder: 'Адрес',
          key: 'company_measure.address',
          value: '',
        },
        // {
        //   label: 'ID Компании',
        //   type: 'textField',
        //   placeholder: '',
        //   key: 'company_id',
        //   value: '',
        // }
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