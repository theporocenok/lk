export const state = () => ({
  screenWidth: 0,
  screenHeight: 0,
  showDrawler: false,
  requestDialog: false,
  refreshRequests: false,
  regions: null,
  laboratories: null,
  transService: null,
  coefficients: null,
  snackState: {
    showSnackBar: false,
    snackBarText: '',
    snackBarColor: 'info',
  },
  userRequests: null,
  userRequestsInterval: null,
  userEvents: null,
  userEventsInterval: null,
});

export const mutations = {
  setScreenWidth(st, width) {
    if (process.browser) {
      st.screenWidth = width;
    }
  },
  setScreenHeight(st, height) {
    if (process.browser) {
      st.screenHeight = height;
    }
  },
  setShowDrawler(st, show) {
    st.showDrawler = show;
    localStorage.setItem('showDrawler', show);
  },
  setRequestDialog(st, show) {
    st.requestDialog = show;
  },
  setRefreshRequests(st, show) {
    st.refreshRequests = show;
  },
  setCountUserRequests(st, count) {
    st.userRequests = count;
  },
  setCountUserRequestsInterval(st, interval) {
    st.userRequestsInterval = interval;
  },
  setCountUserEvents(st, count) {
    st.userEvents = count;
  },
  setUserEventsInterval(st, interval) {
    st.userEventsInterval = interval;
  },
  setSnackParams (st,params = {text:'',color:'info'}) {
    st.snackState.showSnackBar = true;
    st.snackState.snackBarText = params.text;
    st.snackState.snackBarColor = params.color;
  },
  setSnackShow(st,show = false) {
    st.snackState.showSnackBar = show;
  },
  setRegions(st, regions) {
    st.regions = regions;
  },
  setLaboratories(st, laboratories) {
    st.laboratories = laboratories;
  },
  setTransService(st, transService) {
    st.transService = transService;
  },
  setCoefficients(st, coefficients) {
    st.coefficients = coefficients;
  },
};

export const actions = {
  /**
   * Получение списка всех типов цен
   * @returns {Promise<void>}
   */
  async loadRegions() {
    if (!!!this.state.regions) {
      let {data} = (await this.$api.Service.getCosts()).data;
      this.commit('setRegions', data.costs);
    }
  },

  /**
   * Получение количества новых активаций пользователей
   * @returns {Promise<void>}
   */
  async loadCountUserRequests() {
    if (this.state.userRequestsInterval != null) {
      clearInterval(this.state.userRequestsInterval);
    }
    let {data} = (await this.$api.UserRequest.countRequest()).data;
    this.commit('setCountUserRequests', data.count);
    this.commit(
      'setCountUserRequestsInterval',
      setInterval(async () => {
        let {data} = (await this.$api.UserRequest.countRequest()).data;
        this.commit('setCountUserRequests', data.count);
      }, 300000)
    );
  },

  /**
   * Получение количества новых активаций пользователей
   * @returns {Promise<void>}
   */
  async loadCountUserEvents() {
    if (this.state.userEventsInterval != null) {
      clearInterval(this.state.userEventsInterval);
    }
    try {
      let {data} = (await this.$api.UserEvent.countEvents()).data;
      let count = data.count;
      if (count >= 100) {
        count = '99+'
      }
      this.commit('setCountUserEvents', count);
    }catch(e) {
      this.commit('setCountUserEvents', 0);
    }
    this.commit(
      'setUserEventsInterval',
      setInterval(async () => {
        try {
          let {data} = (await this.$api.UserEvent.countEvents()).data;
          let count = data.count;
          if (count >= 100) {
            count = '99+'
          }
          this.commit('setCountUserEvents', count);
        }catch(e) {
          this.commit('setCountUserEvents', 0);
        }
      }, 300000)
    );
  },

  /**
   * Получение списка всех лабораторий
   * @returns {Promise<void>}
   */
  async loadLaboratories() {
    if (!!!this.state.laboratories) {
      let {data} = (await this.$api.Laboratory.all()).data;
      this.commit('setLaboratories', data.laboratories);
    }
  },

  /**
   * Получение услуги "Подготовка к транспортировке"
   * @returns {Promise<void>}
   */
  async loadTransService() {
    if (!!!this.state.transService) {
      let {data} = (await this.$api.CompanyOffer.getTransService()).data;
      this.commit('setTransService', data.service);
    }
  },

  /**
   * Получение надбавок/скидок
   * @returns {Promise<void>}
   */
  async loadCoefficients() {
    if (!!!this.state.coefficients) {
      let {data} = (await this.$api.Service.getCoefficients()).data;
      this.commit('setCoefficients', data.coefficients);
    }
  },

  async nuxtServerInit({dispatch, commit}, {req, app}) {

  },
  nuxtClientInit(store, ctx) {
    setTimeout(() => {
      store.commit('setScreenWidth', window.innerWidth);
      store.commit('setScreenHeight', window.innerHeight);
      window.addEventListener(
        'resize',
        e => {
          store.commit('setScreenWidth', e.target.innerWidth);
          store.commit('setScreenHeight', e.target.innerHeight);
        },
        {passive: true},
      );
    });
  },
};
