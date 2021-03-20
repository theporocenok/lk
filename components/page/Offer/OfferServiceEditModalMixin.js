export const offerServiceEditMixin = {
  props: {
    dialog: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    service: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canEdit: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    serviceCostId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    tariffYear: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      firstLoad: true,

      startServiceDeviceTitle: '',
      noDataSIText: 'Необходимо ввести минимум 3 символа',
      siList: [],//Список подходящих устройств
      searchDevices:'',//Переменная поиска устройств
      devicesSearchTimeout: null,//Ищем не чаще, чем раз в 0.3 секунды

      serviceCosts: [],

      serviceObj: {},//Внутренний объект service
      isEdited: false,//Изменялся ли объект
      searchService: '',//Переменная поиска услуг
      servicesList: [],//Список подходящих услуг

      defaultServicesList: [
        {
          id: '-1',
          title: 'Поверка',
          type: {
            title: 'Поверка',
          }
        },
        {
          id: '-2',
          title: 'Калибровка',
          type: {
            title: 'Калибровка',
          }
        },
        {
          id: '-3',
          title: 'Инструментальный контроль',
          type: {
            title: 'Инструментальный контроль',
          }
        },
        {
          id: '-4',
          title: 'Аттестация',
          type: {
            title: 'Аттестация',
          }
        },
        {
          id: '-5',
          title: 'Юстировка и подготовка к поверке',
          type: {
            title: 'Юстировка и подготовка к поверке',
          }
        },
        {
          id: '-6',
          title: 'Диагностика',
          type: {
            title: 'Диагностика',
          }
        },
        {
          id: '-7',
          title: 'Техническое обслуживание',
          type: {
            title: 'Техническое обслуживание',
          }
        },
        {
          id: '-8',
          title: 'Ремонт',
          type: {
            title: 'Ремонт',
          }
        },
      ],//П/К/Э

      addressBtns: false,

      closeDialog: false,
    }
  },
  computed: {
    addressButtons: {
      get () {
        return this.addressBtns;
      },
      set (v) {
        this.addressBtns = v;
      }
    },
    showDialog: {
      get() {
        return this.dialog;
      },
      set(v) {
        this.$emit('close-dialog')
      }
    },
    editable: {
      get() {
        return this.canEdit;
      }
    },
    deviceObj() {
      return this.serviceObj.service_device_id;
    },
    serviceId() {
      return this.serviceObj.service_id;
    },
    serviceObjCount: {
      get() {
        return this.serviceObj.count ? this.serviceObj.count : 1;
      },
      set(newValue) {
        if (!!newValue) {
          this.serviceObj.count = parseInt(newValue, 10) > 0 ? Math.abs(parseInt(newValue, 10)) : 1;
          return;
        }
        this.serviceObj.count = 1;
      }
    },
    serviceObjCountSets: {
      get() {
        return this.serviceObj.count_sets ? this.serviceObj.count_sets : 1;
      },
      set(newValue) {
        if (!!newValue) {
          this.serviceObj.count_sets = parseInt(newValue, 10) > 0 ? parseInt(newValue, 10) : 1;
          return;
        }
        this.serviceObj.count_sets = 1;
      }
    },

    /**
     * Проверка на администратора
     */
    isAdmin: {
      get() {
        return this.$auth.user.role_id==1;
      }
    },

    isWrongRegion() {
      let costId = this.serviceObj.service_cost_id;
      let serviceCost = this.serviceCosts.find(function (item) {
        return item.id == costId;
      });
      return !!this.serviceCosts && serviceCost
        ? serviceCost.status
        : false;
    }
  },
  watch: {
    dialog: async function (val) {
      if (val) {
        await this.openModal();
        this.firstLoad = false;
      }
    },
    deviceObj: function (val) {
      if (val == null) {
        this.serviceObj.service_id = null;
      }
    },
    serviceId: function (val) {
      this.disableServiceCostsByService();
      this.setTitleOffer();
    },
    serviceObj:{
      handler (val) {
        if (!this.firstLoad) {
          this.isEdited = true;
        }
      },
      deep: true,
    },
  },
  methods: {


    /**
     * Добавление/сохранение СИ в заявке
     */
    saveService() {
      if (this.isAdmin) {
        if (!this.$refs.offerServiceFormAdmin.validate()) {
          return;
        }
      }else{
        if (!this.$refs.offerServiceForm.validate()) {
          return;
        }
      }

      let device = this.getDeviceObj(this.serviceObj.service_device_id.id);
      if (!!device) {
        this.$set(this.serviceObj, 'device', device);
        this.$set(this.serviceObj, 'service_device_id', device.id);
        this.$set(this.serviceObj, 'service_device_title', null);
      }else{
        this.$set(this.serviceObj, 'service_device_title', this.searchDevices);
        this.$set(this.serviceObj, 'service_device_id', null);
      }

      if (this.serviceObj.service_id < 0) {
        this.serviceObj.service_title = this.defaultServicesList[Math.abs(this.serviceObj.service_id)-1].title;
        this.serviceObj.service_id = null;
      }else{
        this.$set(this.serviceObj, 'service', this.getServiceObj(this.serviceObj.service_id));
      }
      /**
       * Заносим скидки/надбавки в массив (костыль для Артёма)
       */
      if (!!this.serviceObj.coefficients) {
        this.serviceObj.coefficients = [this.serviceObj.coefficients];
      }

      if (!this.addressButtons) {
        this.serviceObj.address = '';
      }
      this.$set(this.serviceObj, 'urgency', this.serviceObj.urgency ? 1 : 0);
      this.$emit('save-item', this.serviceObj);
      this.closeFunc();
    },


    /**
     * Функция, выполняющаяся во время открытия модалки
     */
    async openModal() {
      this.firstLoad = true;
      this.serviceCosts = this.cloneRegions();
      if (this.isAdmin) {
        if (!!this.$refs.offerServiceFormAdmin) {
          this.$refs.offerServiceFormAdmin.resetValidation();
        }
      }else{
        if (!!this.$refs.offerServiceForm) {
          this.$refs.offerServiceForm.resetValidation();
        }
      }
      //Клонируем пришедший объект во внутренний для манипуляций
      // this.serviceObj = Object.assign({}, this.service, this.getStartCostValues());
      this.serviceObj = Object.assign({}, this.service);
      this.addStartCostValues(this.serviceObj);

      //Если объект пустой, заполняем нужные поля
      if (Object.keys(this.service).length == 0) {
        this.$set(this.serviceObj, 'laboratory_id', this.laboratoryId);
        this.$set(this.serviceObj, 'service_id', null);
      }
      /**
       * Если есть СИ
       */
      if (this.serviceObj.service_device_id) {
        await this.getDevicesListById(this.service.service_device_id);
        this.$set(this.serviceObj, 'service_device_id', this.getDeviceObj(this.serviceObj.service_device_id));
        this.servicesList = this.servicesList.concat(this.defaultServicesList);
        await this.getServicesListByDeviceId(this.serviceObj.service_device_id);
        this.addressButtons = !!this.serviceObj.address;
      }else{
        if (!!this.service.service_title) {
          this.servicesList = this.servicesList.concat(this.defaultServicesList);
          this.serviceObj.service_id = await this.getDefaultServicesIdByTitle(this.service.service_title);
        }
      }
      /**
       * Если есть кастомное назване СИ
       */
      if (!!this.serviceObj.service_device_title) {
        this.$set(this.serviceObj, 'service_device_id', {id: -1, title_full: this.serviceObj.service_device_title});
      }
      /**
       * Если есть регион цен
       */
      if (!!!this.serviceObj.service_cost_id) {
        this.$set(this.serviceObj, 'service_cost_id', this.serviceCostId);
      }
      /**
       * Если есть скидки/надбавки, достаем первую из массива (костыль для Артёма)
       */
      if (!!this.serviceObj.coefficients) {
        this.$set(this.serviceObj, 'coefficients', this.serviceObj.coefficients[0]);
      }
      if (this.isAdmin) {
        this.setTariff();
      }
      this.disableServiceCostsByService();
    },


    /**
     * Уверены, что желаете закрыть без сохранения?
     */
    checkBeforeClose() {
      if (this.editable && this.isEdited) {
        this.closeDialog = true;
      }else{
        this.closeFunc();
      }
    },

    /**
     * Закрыть модалку редактирования СИ и очистить все поля
     */
    closeFunc() {
      this.firstLoad = true;

      this.noDataSIText = 'Необходимо ввести минимум 3 символа';
      this.siList = [];//Список подходящих устройств
      this.searchDevices ='';//Переменная поиска устройств

      this.serviceObj = {};//Внутренний объект service
      this.isEdited = false;
      this.searchService = '';//Переменная поиска услуг
      this.servicesList = [];//Список подходящих услуг
      this.addressBtns = false;
      this.showDialog = false;
    },


    /**
     * Объект начальных значения для суммы, НДС, суммыс НДС
     */
    getStartCostValues() {
      return {
        tariff: !!this.service.tariff ? this.service.tariff : '',
        discount_prc: !!this.service.discount_prc ? this.service.discount_prc : 0,
        increase_prc: !!this.service.increase_prc ? this.service.increase_prc : 0,
        count: Object.keys(this.service).length ? this.service.count : 1,
        count_sets: Object.keys(this.service).length ? this.service.count_sets : 1,
      }
    },

    /**
     * Объект начальных значения для суммы, НДС, суммыс НДС
     */
    addStartCostValues(obj) {
      this.$set(obj, 'tariff', !!this.service.tariff ? this.service.tariff : '');
      this.$set(obj, 'discount_prc', !!this.service.discount_prc ? this.service.discount_prc : 0);
      this.$set(obj, 'increase_prc', !!this.service.increase_prc ? this.service.increase_prc : 0);
      this.$set(obj, 'count', Object.keys(this.service).length ? this.service.count : 1);
      this.$set(obj, 'count_sets', Object.keys(this.service).length ? this.service.count_sets : 1);
    },


    /**
     * Поиск СИ по ID
     */
    async getDevicesListById(id) {
      try {
        let {data} = (await this.$api.ServiceDevice.find(id)).data;
        this.siList = data.result;
      }catch{
        this.$store.commit('setSnackParams', {
          text: 'Ошибка при поиске СИ',
          color: 'error'
        });
      }
      return;
    },

    /**
     * Обработчик ввода текста в поле поиска СИ
     */
    searchDevicesFunc(event) {
      let wrongKeys = ['Shift', 'Escape', 'Alt', 'Ctrl'];
      if (wrongKeys.includes(event.key)) {
        return;
      }
      this.getDevicesList();
    },

    /**
     * Поиск СИ по введённым символам
     * @param searchText - Переменная для поиска текста
     * @param noData - Текст при отсутствии результатов поиска
     * @param timeout - Таймер на запрос (не чаще 500мс)
     * @param list - Список компаний по запросу
     * @returns {Promise<void>}
     */
    async getDevicesList(searchText = this.searchDevices,
                         timeout = this.devicesSearchTimeout,
                         list = this.siList) {

      this.setTitleOffer();
      /**
       * Если в поле поиска пусто или менее 3 символов
       */
      if (!searchText || searchText.length < 3) {
        this.noDataSIText = "Необходимо ввести минимум 3 символа";
        list.splice(0);
        this.serviceObj.service_id = null;
        this.setDefaultServicesList();
        return;
      }

      /**
       * Если автокомплит для СИ содержит кастомное название
       */
      if (!!!this.serviceObj.service_device_id || searchText != this.serviceObj.service_device_id.title_full) {
        this.serviceObj.service_id = null;
        this.setDefaultServicesList();
      }

      this.noDataSIText = 'Поиск...';
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try{
          let {data} = (await this.$api.ServiceDevice.searchText(searchText)).data;
          if (data.result.length == 0) {
            this.noDataSIText = "Ничего не найдено";
            list.splice(0);
            // this.serviceObj.service_device_id = null;
          }else{
            this.noDataSIText = '';
            let outerThis = this;
            data.result.map(function (item, key) {
              outerThis.$set(list, key, item);
            })
          }

          clearTimeout(timeout);
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при поиске СИ',
            color: 'error'
          });
        }
      }, 500);
    },

    /**
     * Поиск услуги по её title
     * @param service_title
     * @param servicesList
     * @returns {Promise<void>}
     */
    async getDefaultServicesIdByTitle(service_title = null,
                                      servicesList = this.servicesList) {
      servicesList = [].concat(this.defaultServicesList);
      let resService = servicesList.find(function(service) {
        return service_title === service.title;
      });
      return resService.id;
    },

    /**
     * Поиск услуг по device_id
     * @param device_id
     * @param servicesList
     * @returns {Promise<void>}
     */
    async getServicesListByDeviceId(device_id = this.service.service_device_id,
                                    servicesList = this.servicesList) {

      if (!!device_id && !!device_id.id) {
        device_id = device_id.id;
      }else{
        return;
      }
      if (!this.firstLoad) {
        this.serviceObj.service_id = null;
      }
      if (device_id == null) {
        return;
      }

      try {
        let {data} = (await this.$api.Service.getByDevice(device_id)).data;

        servicesList.splice(0);
        let outerThis = this;
        data.result.map(function(service, index) {
          outerThis.$set(servicesList, index, service);
        });

        if (servicesList.length == 1) {
          this.$set(this.serviceObj, 'service_id', servicesList[0].id);
        }

        if (!!!servicesList || !servicesList.length) {
          this.servicesList = servicesList.concat(this.defaultServicesList);
          this.serviceObj.service_id = null;
        }

        this.setGrsi();
        this.setTitleOffer();
        return;
      }catch{
        this.$store.commit('setSnackParams', {
          text: 'Ошибка при поиске услуг для СИ',
          color: 'error'
        });
      }
    },

    /**
     * Заполняем массив услуг дефолтными услугами
     */
    setDefaultServicesList(servicesList = this.servicesList,
                           defaultServicesList = this.defaultServicesList) {
      servicesList.splice(0);
      let outerThis = this;
      defaultServicesList.map(function(service, index) {
        outerThis.$set(servicesList, index, service);
      });
    },

    /**
     * Блокируем сервисы, недоступные в регионе
     */
    disableServiceCostsByService() {
      let service_id = this.serviceObj.service_id;
      let choosenService = !!!this.servicesList ? null : this.servicesList.find(function(service) {
        return service.id == service_id;
      });
      if (!!!choosenService || !!!choosenService.costs) {
        this.serviceCosts = this.cloneRegions();
        return;
      }
      let outerthis = this;
      let messages = [];
      this.serviceCosts.forEach(function(cost, index) {
        let isCostInService = choosenService.costs.find(function(serviceCost) {
          return serviceCost.service_cost_id == cost.id && serviceCost.year == outerthis.tariffYear;
        });
        let costForUser = outerthis.isAdmin && !!isCostInService ? parseFloat(isCostInService.cost).toLocaleString('ru-RU') + ' руб' : '';
        let message = !!isCostInService ? costForUser : 'Не оказывается в этом регионе';
        // outerthis.serviceCosts[index].title_for_select = cost.title + ' ' + message;
        // outerthis.$set(outerthis.serviceCosts[index], 'title_for_select', cost.title + ' ' + message);
        messages.push({
          message: message,
          status: !!!isCostInService,
        });
      });
      this.serviceCosts = this.cloneRegions(messages);
    },

    /**
     * Установка ГРСИ при смене СИ
     */
    setGrsi() {
      if (this.firstLoad) {
        return;
      }
      let currDevice = !!this.serviceObj.service_device_id
        ? this.serviceObj.service_device_id
        : null;


      this.serviceObj.grsi = !!currDevice
        ? currDevice.grsi
        : '';
    },

    /**
     * Установка Названия для КП при смене СИ или Услуги
     */
    setTitleOffer() {
      if (this.firstLoad) {
        return;
      }

      let currDevice = !!this.serviceObj.service_device_id ? this.serviceObj.service_device_id : null;

      this.$set(this.serviceObj,
        'service_title_offer',
        !!currDevice
          ? currDevice.title_full
          : this.searchDevices
      );

      if (this.serviceObj.service_id) {
        let currServiceId = this.serviceObj.service_id;
        let currService = this.servicesList.find(function (item) {
          return item.id == currServiceId;
        });
        if (!!currService) {
          this.$set(this.serviceObj,
            'service_title_offer',
            currService.type.title + '. ' + this.serviceObj.service_title_offer);
        }
      }
    },

    /**
     * Получение объекта СИ, если оно было выбрано
     * @param id - id СИ
     * @returns {*}
     */
    getDeviceObj(id) {
      return this.siList.find(function(si) {
        return si.id === id;
      });
    },

    /**
     * Получение объекта услуги, если она была выбрано
     * @param id - id услуги
     * @returns {*}
     */
    getServiceObj(id) {
      return this.servicesList.find(function(service) {
        return service.id === id;
      });
    },


    /**
     * Обработчик ввода данных в поле количества
     */
    serviceObjCountKeyDown(event) {
      if (event.key==',' || event.key=='-' || event.key=='.' || event.key=='e') {
        event.preventDefault();
      }
    },

    /**
     * Клонирование массива регионов из store
     * @returns {[]}
     */
    cloneRegions(messages = null) {
      let regions = [];
      let outerThis = this;
      this.$store.state.regions.forEach(function (region,index) {
        let tempRegion = Object.assign({}, region);
        // tempRegion.title_for_select = tempRegion.title;
        outerThis.$set(tempRegion, 'title_for_select', !!messages ? tempRegion.title + ' ' + messages[index].message : tempRegion.title);
        outerThis.$set(tempRegion, 'status', !!messages ? messages[index].status : false);
        outerThis.$set(tempRegion, 'message', !!messages ? messages[index].message : '');
        regions.push(tempRegion);
      });
      return regions;
    }
  }
}