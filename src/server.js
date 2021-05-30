const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : 'io.erikrios.github',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  try {
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (e) {
    console.log(e.message);
  }
};

init();
