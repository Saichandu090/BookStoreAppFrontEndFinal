import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { loginGuard } from './guards/login.guard';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { WishListComponent } from './components/wish-list/wish-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path:"adminRegister",
        component:AdminRegisterComponent
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
            path:'create-order',
            component:CreateOrderComponent,
            canActivate:[loginGuard]
        },
        {
            path:'orders',
            component:OrdersComponent,
            canActivate:[loginGuard]
        },
        {
            path:'wishlist',
            component:WishListComponent,
            canActivate:[loginGuard]
        }
    ]
    }
];
