import App from "./app";
import AdminRoute from "./routes/admin.route";
import AuthRoute from "./routes/auth.route";
import FoodRoute from "./routes/food.route";
import LunchRoute from "./routes/lunch.route";
import OrderRoute from "./routes/order.route";
import OrgRoute from "./routes/org.route";
import ProductRoute from "./routes/product.route";
import SettingsRoute from "./routes/settings.route";
import TripRoute from "./routes/trip.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new OrgRoute(),
  new ProductRoute(),
  new FoodRoute(),
  new SettingsRoute(),
  new ProductRoute(),
  new OrderRoute(),
  new LunchRoute(),
  new AdminRoute(),
  new TripRoute()
]);

app.listen()

