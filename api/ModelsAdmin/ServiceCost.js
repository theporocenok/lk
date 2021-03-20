export default (ORM = null, Request = null) => {

  return {
    name: "Типы цен",
    url: "service-cost",
    icon: "mdi-book-multiple",
    translate: 'cities.name',
    searchable: false,
    show: {
      add: true,
      edit: true,
      delete: false
    },
    table: {
      sortBy: 'title',
      sortDesc: false,
      per_page: 10,
      fields: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "title",
          label: "Название",
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