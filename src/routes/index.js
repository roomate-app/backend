import authRoutes from './auth.router.mjs';
import userRoutes from './users.router.js';
import roomRoutes from './rooms.router.js';



const routerApi = (app) => {
  app.use(`/auth`, authRoutes);
  app.use(`${process.env.basePath}/users`, userRoutes);
  app.use(`${process.env.basePath}/rooms`, roomRoutes);
}

export default routerApi;
