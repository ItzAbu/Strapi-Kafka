

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pubs/newPub',
      handler: 'pub.newPub',
      config: {
        policies: [],
      },
    },
  ],
};
