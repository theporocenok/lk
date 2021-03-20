import moment from "moment";
moment.locale('ru');

export default ({app, $axios}, inject) => {


  const listFunctions = {

    checkEmailRules(email) {
      if (!!email && !/.+@.+\..+/.test(email)) {
        return 'Некорректный email';
      }
      return 'Введите email';
    },

    checkPasswordRules(password) {
      if (password.length < 6) {
        return 'Не менее 6 символов';
      }
      return 'Введите пароль';
    },

    checkPasswordConfirmationRules(password, passwordConfirmation) {
      if (password != passwordConfirmation) {
        return 'Пароли не совпадают';
      }
      return this.checkPasswordRules(password);
    },

    checkPhoneRules(phone) {
      if (!!phone && phone.length != 18) {
        return 'Нужен 11-значный формат';
      }
      return 'Введите номер';
    },

    getDomain(){
      const domain = window.location.hostname.split('.',1).toString();
      if(domain != 'abonement'){
        return domain;
      }
      return null;
    },

    isMobile(){
      if(app.store.state.screenWidth<1000){
        return true;
      }
      return false;
    },

    screenWidth(){
      return app.store.state.screenWidth;
    },

    convertDate(date, format = 'DD MMMM YYYY'){
      return moment(date).format(format);
    },

    convertDateTcsm(date) {
      if (!!!Date.parse(date)) {
        return '';
      }
      return new Date(Date.parse(date)).toLocaleDateString('ru-RU');
    },

    convertHexToRGB(hexColor) {
      let r = 0, g = 0, b = 0;

      // 3 digits
      if (hexColor.length == 4) {
        r = "0x" + hexColor[1] + hexColor[1];
        g = "0x" + hexColor[2] + hexColor[2];
        b = "0x" + hexColor[3] + hexColor[3];

        // 6 digits
      } else if (hexColor.length == 7) {
        r = "0x" + hexColor[1] + hexColor[2];
        g = "0x" + hexColor[3] + hexColor[4];
        b = "0x" + hexColor[5] + hexColor[6];
      }

      return +r + "," + +g + "," + +b;
    },

    countActiveFilters(obj, muteKeys = []) {
      let count = 0;
      Object.keys(obj).forEach(key => {
        if (!muteKeys.includes(key) && !!obj[key] && (typeof(obj[key]) != 'object' || obj[key].length > 0)) {
          count++;
        }
      });
      return count;
    },

    addDaysToDate(date, days) {
      if (!!!date) {
        return '';
      }

      if (!!days) {
        let currDate = new Date(date);
        let daysToAdd = days;
        let checkDate = currDate.setDate(currDate.getDate() + daysToAdd);
        checkDate = new Date(checkDate);
        return this.convertDate(checkDate, 'DD MMMM YYYY');
      }

      return this.convertDate(date, 'DD MMMM YYYY');
    },

    convertRange(date_start,date_end) {
      let start = moment(date_start);
      let end = moment(date_end);

      let result_date = "";
      if ( start.year() == end.year() ) {

        if ( start.month() == end.month() ) {
          // пишем месяц только в одной дате
          result_date +=
              start.format("D") + ' - ' +
              end.format("D MMMM");

        } else {
          // пишем месяц в обеих датах
          result_date +=
              start.format("D MMMM") + ' - ' +
              end.format("D MMMM");
        }


        if ( start.year() != moment().year() ) {
          // дописываем год
          result_date +=
              start.format("YYYY")
        }
      } else {
        // полная дата
        result_date +=
            start.format("D MMMM YYYY") + ' - ' +
            end.format("D MMMM YYYY");
      }


      return result_date;
    },

    convertDateIcon(item) {

      let advert_period_start = moment(item.date_start);
      let advert_period_end = moment(item.date_end);
      let today = moment();

      let advert = {};
      // advert.today = today;
      // advert.advert_period_start = advert_period_start;
      // advert.advert_period_end = advert_period_end;

      advert.future = advert_period_start.isAfter( today, 'day' ); // start еще не наступила
      advert.past = advert_period_end.isBefore( today, 'day' ); // end уже прошло
      advert.actual =
          today.isSameOrAfter(advert_period_start, 'day') // сегодня между датами начала и конца
          && today.isSameOrBefore(advert_period_end, 'day'); // сегодня между датами начала и конца

      // console.log("item", item, item.date_start, item.date_end, advert);
      if(advert.future){
        return {
          color: 'orange',
          icon: "mdi-clock-outline"
        };
      } else if(advert.actual) {
        return {
          color: 'green',
          icon: "mdi-eye-check-outline"
        };
      } else if(advert.past) {
        return {
          color: 'grey',
          icon: "mdi-eye-off-outline"
        };
      }
      return {};
    }
  };



  inject('helpers', listFunctions);
}
