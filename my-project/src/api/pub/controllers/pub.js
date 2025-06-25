'use strict';

/**
 * pub controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pub.pub', ({strapi}) => ({
    async find(ctx) {
    try {
      const result = await strapi.entityService.findMany('api::pub.pub', {
        populate: '*',
        filters: ctx.query.filters || {},
        sort: ctx.query.sort || {},
        pagination: ctx.query.pagination || {}
      });
      return this.transformResponse(result);
    } catch (err) {
      strapi.log.error('Error fetching pubs', err);
      return ctx.internalServerError('Failed to fetch pubs');
    }
  },

  async affordable(ctx) {
    try {
      let maxPrice = ctx.query.maxPrice ? parseFloat(ctx.query.maxPrice) : Number.MAX_SAFE_INTEGER;
      if (maxPrice < 0) maxPrice = Number.MAX_SAFE_INTEGER;
      
      const sort = ctx.query.sortBy || 'avgPrice:asc';
      const pubs = await strapi.service('api::pub.pub').getAffordablePubs(maxPrice, sort);
      
      return this.transformResponse(pubs);
    } catch (err) {
      strapi.log.error('Error fetching affordable pubs', err);
      return ctx.internalServerError('Failed to fetch affordable pubs');
    }
  },

  async newPub(ctx) {
    try {
      const { name, address, avgPrice } = ctx.request.body;

      if (!name || !address || avgPrice === undefined) {
        return ctx.badRequest('Missing required fields');
      }


        const data = {
          attributes: {
            name,
            address,
            avgPrice,
            picture: {
              data: {
                id: 1,
                attributes: {
                  name: "pub.jpg",
                  alternativeText: null,
                  caption: null,
                  width: 275,
                  height: 183,
                  formats: {
                    thumbnail: {
                      name: "thumbnail_pub.jpg",
                      hash: "thumbnail_pub_82cc137aed",
                      ext: ".jpg",
                      mime: "image/jpeg",
                      path: null,
                      width: 234,
                      height: 156,
                      size: 12.26,
                      sizeInBytes: 12258,
                      url: "/uploads/thumbnail_pub_82cc137aed.jpg"
                    }
                  },
                  hash: "pub_82cc137aed",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  size: 15.25,
                  url: "/uploads/pub_82cc137aed.jpg",
                  previewUrl: null,
                  provider: "local",
                  provider_metadata: null,
                  folderPath: "/",
                  createdAt: "2025-06-20T14:02:52.877Z",
                  updatedAt: "2025-06-20T14:02:52.877Z"
                }
              }
            }
          }
        };

        await strapi.service('api::new-entry-pub.new-entry-pub').newNoti('pub.create', data, 'email');
        
        return data;
    } catch (err) {
      strapi.log.error('Creation error:', err);
      return ctx.internalServerError('Error creating pub');
    }
  }
}));
