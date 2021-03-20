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

  
  return {
    name: "Список заявок на КП",
    url: "cabinet/offers",
    icon: "mdi-format-list-checks",
    translate: 'menu.offer',
    dialogWidth: '80vw',
    searchable: false,
    show: {
      add: true,
      edit: false,
      delete: false
    },
    
    table: {
      sortBy: [],
      sortDesc: false,
      per_page: 10,
      slots:[
        {column:'item.company.title'},
        {column:'item.created_at'},
        {column:'item.number'},
        {column:'item.urgency_services_count'},
        {column:'item.status.title'},
        {column:'item.calculated.sum'},
        {column:'item.contact_title'},
      ],
      fields: [
        {
          key: 'created_at',
          label: 'Дата заявки',
        },
        {
          key: "company.title",
          label: "Компания",
        },
        {
          key: "contact_title",
          label: "ФИО / Телефон",
        },
        {
          key: 'number',
          label: 'Дата, номер КП',
        },
        {
          key: "urgency_services_count",
          label: "Срочность",
          sortable:false,
        },
        {
          key: "calculated.sum",
          label: "Сумма",
          sortable:false,
        },
        {
          key: "status.title",
          label: "Статус заявки",
          width: '100px',
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
        // {
        //   label: 'Компания',
        //   type: 'autocomplete',
        //   placeholder: '',
        //   items: async ( editedItem ) => {
        //     // подгружаем только выбранный элемент
        //     let company = editedItem.find((item) => item.key === 'company_id');
        //     return await getCompanies({searchId:company.value});
        //   },
        //   multiple: false,
        //   key: 'company_id',
        //   value: '',
        //   onKeyUp: async (form, field) => {
        //     // ищем по совпадению
        //     if(!field.search_input || field.search_input.length<3) return;
        //     let company = form.find((item) => item.key === 'company_id');
        //     company.items = await getCompanies({searchText:field.search_input});
        //   },
        //   onChange: async (form, field) => {
        //     let company = form.find((item) => item.key === 'company_id');
        //     company.items = await getCompanies({companyId:field.value});
        //   },
        // },
        // {
        //   label: 'Договоры',
        //   type: 'autocomplete',
        //   placeholder: '',
        //   items: await getOrders(),
        //   key: 'order_id',
        //   value: '',
        // },
        // {
        //   label: 'Срочность',
        //   type: 'checkbox',
        //   placeholder: '',
        //   key: 'urgency',
        //   value: '',
        // },
        // {
        //   label: 'Подготовка к транспортировке',
        //   type: 'checkbox',
        //   placeholder: '',
        //   key: 'transport_preparation',
        //   value: '',
        // },
        // {
        //   label: 'Комментарий',
        //   type: 'textarea',
        //   placeholder: '',
        //   key: 'description',
        //   editor: false,
        //   editor_switch: false,
        //   value: '',
        // },
        // {
        //   label: 'Услуги',
        //   type: 'slot',
        //   key: 'invoiceitems',
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