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
  RoleRoute,
  MealPollRoute,
  PollVoteRoute,
  AnaliticsRoute
} from '@routes'

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new AnaliticsRoute(),
  new OrgRoute(),
  new FoodRoute(),
  new ProductRoute(),
  new OrderRoute(),
  new LunchRoute(),
  new AdminRoute(),
  new ProductLogRoute(),
  new PaymentRoute(),
  new LunchBaseRoute(),
  new RoleRoute(),
  new MealPollRoute(),
  new PollVoteRoute()
])

app.listen()
