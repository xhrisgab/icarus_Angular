import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { ControlComponent } from './pages/control/control.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';

export const routes: Routes = [
    {
        path:'',
        component: HomePageComponent,
    },
    {
        path:'control',
        component: ControlComponent,
    },
    {
        path:'history/:id',
        component: HistoryPageComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
