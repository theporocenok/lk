export default (Request) => {
  return {
      listStatuses: async (noDraft) => {
            return await Request(`company-offers/statuses`).get({noDraft: noDraft});
      },
      update: async (data) => {
            return await Request(`company-offers/${data.id}/`).put(data);
      },
      create: async (data) => {
            return await Request(`company-offers/`).post(data);
      },
      calc: async (companyOffer) => {
            return await Request(`company-offers/calc`).post(companyOffer);
      },
      printOffer: async (company_offer_id) => {
            return await Request(`company-offers/${company_offer_id}/offer.pdf`).download();
      },
      cancel: async (company_offer_id, comment) => {
            return await Request(`company-offers/${company_offer_id}/cancel`).post({comment_cancel: comment});
      },
      delete: async (company_offer_id) => {
            return await Request(`company-offers/${company_offer_id}/delete`).post();
      },
      send: async (company_offer_id) => {
            return await Request(`company-offers/${company_offer_id}/send`).post();
      },
      ready: async (company_offer_id) => {
            return await Request(`company-offers/${company_offer_id}/ready`).post();
      },
      getTransService: async() => {
            return await Request(`company-offers/getTransService`).get();
      },
      canEdit: async(id) => {
            return await Request(`company-offers/${id}/check`).get();
      },
      review: async(id) => {
            return await Request(`company-offers/${id}/review`).get();
      },
      find: async(id) => {
            return await Request(`company-offers/find/${id}/`).get()
      }
  };
}
