import App from "./app";
import AuthRoute from "./routes/auth.route";
import ProductRoute from "./routes/product.route";
import SettingsRoute from "./routes/settings.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new SettingsRoute(),
  new ProductRoute()
]);

app.listen()