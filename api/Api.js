import Auth from '../api/Api/Auth';
import CityObjectField from '../api/Api/CityObjectField';
import Media from '../api/Api/Media';
import Mail from '../api/Api/Mail';
import Mailing from '../api/Api/Mailing';
import CityObject from '../api/Api/CityObject';
import Company from "../api/Api/Company";
import CompanyDevice from "../api/Api/CompanyDevice";
import CompanyOffer from "../api/Api/CompanyOffer";
import CompanyOrder from "../api/Api/CompanyOrder";
import CompanyInvoice from "../api/Api/CompanyInvoice";
import User from "../api/Api/User";
import UserCompany from "../api/Api/UserCompany";
import UserRequest from "../api/Api/UserRequest";
import UserEvent from "../api/Api/UserEvent";
import UserNotify from "../api/Api/UserNotify";
import News from "../api/Api/News";
import Laboratory from "../api/Api/Laboratory";
import Service from "../api/Api/Service";
import ServiceDevice from "../api/Api/ServiceDevice";

export default (Request) => {
  return {
    Auth: Auth(Request),
    CityObjectField: CityObjectField(Request),
    Media: Media(Request),
    Mail: Mail(Request),
    Mailing: Mailing(Request),
    CityObject: CityObject(Request),
    Company: Company(Request),
    CompanyDevice: CompanyDevice(Request),
    CompanyOffer: CompanyOffer(Request),
    CompanyOrder: CompanyOrder(Request),
    CompanyInvoice: CompanyInvoice(Request),
    User: User(Request),
    Laboratory: Laboratory(Request),
    UserCompany: UserCompany(Request),
    UserRequest: UserRequest(Request),
    UserEvent: UserEvent(Request),
    UserNotify: UserNotify(Request),
    News: News(Request),
    Service: Service(Request),
    ServiceDevice: ServiceDevice(Request),
  };
}
