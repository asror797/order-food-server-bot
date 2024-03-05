import App from './app'
import {
  UserRoute,
  AuthRoute,
  OrderRoute,
  AdminRoute,
  FoodRoute,
  LunchBaseRoute,
  LunchRoute,
  OrgRoute,
  PaymentRoute,
  ProductLogRoute,
  ProductRoute,
  RoleRoute
} from '@routes'

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new OrgRoute(),
  new FoodRoute(),
  new ProductRoute(),
  new OrderRoute(),
  new LunchRoute(),
  new AdminRoute(),
  new ProductLogRoute(),
  new PaymentRoute(),
  new LunchBaseRoute(),
  new RoleRoute()
])

app.listen()
