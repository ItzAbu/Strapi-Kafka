

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pubs/affordable',
      handler: 'pub.affordable',
      config: {
        policies: [],
      },
    },
  ],
};
