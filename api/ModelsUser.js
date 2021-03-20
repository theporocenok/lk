import ORM from "./ORM";
import Service from "./ModelsUser/Service";
import CompanyDevice from "./ModelsUser/CompanyDevice";
import CompanyInvoice from "./ModelsUser/CompanyInvoice";
import CompanyOffer from "./ModelsUser/CompanyOffer";
import ServiceDevice from "./ModelsUser/ServiceDevice";
import ServiceType from "./ModelsUser/ServiceType";
import ServiceCost from "./ModelsUser/ServiceCost";
import ServiceDimension from "./ModelsUser/ServiceDimension";
// import Role from "./ModelsUser/Role";


export default (Request, app) => {

  const ORMUser = ORM(Request, 'lists/');

  // const roles = Role(ORM(Request)('roles'));


  return {
    // Role: roles,
    Service: Service(ORMUser('services')),
    CompanyDevice: CompanyDevice(ORMUser('company-devices')),
    CompanyInvoice: CompanyInvoice(ORMUser('invoices')),
    CompanyOffer: CompanyOffer(ORMUser('company-offers')),
    ServiceDevice: ServiceDevice(ORMUser('service-devices')),
    ServiceType: ServiceType(ORMUser('service-types')),
    ServiceCost: ServiceCost(ORMUser('service-costs')),
    ServiceDimension: ServiceDimension(ORMUser('service-dimensions')),
  };
}
