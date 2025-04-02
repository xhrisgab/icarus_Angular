import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { ControlComponent } from './pages/control/control.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { History2PageComponent } from './pages/history-page2/history2-page.component';

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
        path:'history2/:id',
        component: History2PageComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
