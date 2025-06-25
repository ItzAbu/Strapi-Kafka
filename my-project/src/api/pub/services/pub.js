'use strict';

/**
 * pub service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pub.pub', ({ strapi}) => ({
    async getAffordablePubs(maxPrice, sortBy) {
    const pubs = await strapi.entityService.findMany('api::pub.pub', {
      filters: {
        avgPrice: {
          $lte: maxPrice,
        },
      },
      sort: sortBy,
      populate: '*',
    });
    return pubs;
  },

  async update(id, data) {
    const pub = await super.update(id, data);
    return pub;
  },

}));
