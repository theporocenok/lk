import ORM from "./ORM";
import Role from "./ModelsAdmin/Role";
import User from "./ModelsAdmin/User";
import City from "./ModelsAdmin/City";
import Company from "./ModelsAdmin/Company";
import CompanyOrder from "./ModelsAdmin/CompanyOrder";
import CompanyOffer from "./ModelsAdmin/CompanyOffer";
import CompanyInvoice from "./ModelsAdmin/CompanyInvoice";
import CompanyInvoiceKP from "./ModelsAdmin/CompanyInvoiceKP";
import CompanyInvoiceItem from "./ModelsAdmin/CompanyInvoiceItem";
import CompanyInvoiceItemMeasure from "./ModelsAdmin/CompanyInvoiceItemMeasure";
import UserRequest from "./ModelsAdmin/UserRequest";
import UserAdminNotify from "./ModelsAdmin/UserAdminNotify";
import UserAdminNotifyGroup from "./ModelsAdmin/UserAdminNotifyGroup";
import ServiceCost from "./ModelsAdmin/ServiceCost";
import Setting from "./ModelsAdmin/Setting";
import SettingGroup from "./ModelsAdmin/SettingGroup";
import Mailing from "./ModelsAdmin/Mailing";


export default (Request, app) => {
  const ORMAdmin = ORM(Request, 'admin/');

  const roles = Role(ORMAdmin('roles'));
  const serviceCosts = ServiceCost(ORMAdmin('service-costs'));
  const users = User(
      ORMAdmin('users'),
      roles,
      serviceCosts
  );

  const companies = Company(
      ORMAdmin('companies'),
      users
  );

  const companyOrder = CompanyOrder(ORMAdmin('orders'));

  const companyInvoiceKP = CompanyInvoiceKP(ORMAdmin('invoices'),
      companies,
      companyOrder
  );

  const adminnotifies = UserAdminNotify(ORMAdmin('admin-notifies'),
      users
  );


  const settingGroup = SettingGroup(ORMAdmin('setting-groups'));
  const setting = Setting(ORMAdmin('settings'),
      settingGroup
  );
  
  return {
    Role: roles,
    User: users,
    City: City(ORMAdmin('cities')),
    Company: companies,
    CompanyOrder: companyOrder,
    CompanyInvoice: CompanyInvoice(ORMAdmin('invoices')),
    CompanyOffer: CompanyOffer(ORMAdmin('company-offers')),
    CompanyInvoiceKP: companyInvoiceKP,
    CompanyInvoiceItem: CompanyInvoiceItem(ORMAdmin('invoice-items')),
    CompanyInvoiceItemMeasure: CompanyInvoiceItemMeasure(ORMAdmin('invoice-item-measures')),
    UserRequest: UserRequest(ORMAdmin('user-requests')),
    UserAdminNotify: adminnotifies,
    UserAdminNotifyGroup: UserAdminNotifyGroup(ORMAdmin('admin-notify-groups')),
    ServiceCost: serviceCosts,
    Setting: setting,
    SettingGroup: settingGroup,
    Mailing: Mailing(ORMAdmin('mailing')),
  };
}
