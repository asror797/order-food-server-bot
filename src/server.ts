import App from "./app";
import AuthRoute from "./routes/auth.route";
import FoodRoute from "./routes/food.route";
import OrgRoute from "./routes/org.route";
import ProductRoute from "./routes/product.route";
import SettingsRoute from "./routes/settings.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new OrgRoute(),
  new ProductRoute(),
  new FoodRoute(),
  new SettingsRoute(),
  new ProductRoute()
]);

app.listen()