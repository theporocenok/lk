 export default ({app, $config}, inject) => {

    const config = {
        defaultColor: '#006e4c',
        defaultColorD: '#006e4c',
        bgGreen: 'rgba(26, 211, 0, 0.1)',
        bgGrey: '#EFEFEF',
        bgYellow: 'rgba(203, 196, 24, 0.1)',
        companyName: '',
        companyRequisites: '',
        companyAddress: '',
        companyEmail: '',
        siteUrl: '',
        offerStatuses: {
            draft: 1,
            newOffer: 10,
            underConsideration: 20,
            sentOffer: 30,
            canceled: 40,
        },
        rules: {
            emailRules: [
                email => !!email || 'Обязательно для заполнения',
                email => /.+@.+\..+/.test(email) || 'Некорректный email',
            ],
            passwordRules: [
                password => !!password || 'Обязательно для заполнения',
                password => (password && password.length >= 6) || 'Не менее 6 символов',
            ],
            phoneRules: [
                phone => (!!phone && phone.length == 18) || 'Номер телефона обязателен и должен содержать 11 цифр',
            ],
        }
    };


    inject('config', config);
};