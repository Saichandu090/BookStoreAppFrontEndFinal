import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LayoutComponent } from './components/layout/layout.component';
import { loginGuard } from './guards/login.guard';

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
        path: '',
        component: LayoutComponent,
        children: [
        {
            path: 'homepage',
            component: HomepageComponent,
            canActivate: [loginGuard]
        }]
    }
];
