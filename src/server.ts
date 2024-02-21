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
  TripRoute,
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
  new TripRoute(),
  new ProductLogRoute(),
  new PaymentRoute(),
  new LunchBaseRoute(),
  new RoleRoute()
])

app.listen()
