import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { loginGuard } from './guards/login.guard';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: UserLoginComponent
  },
  {
    path: "adminRegister",
    component: AdminRegisterComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'homepage',
        component: HomepageComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'wishlist',
        component: WishListComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'order-placed',
        component: OrderConfirmationComponent,
        canActivate: [loginGuard]
      }
    ]
  }
];
