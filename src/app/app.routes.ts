import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './components/favorites-page.component';
import { HistoryPageComponent } from './components/history-page.component';
import { SearchPageComponent } from './components/search-page.component';

export const routes: Routes = [
	{
		path: '',
		component: SearchPageComponent,
	},
	{
		path: 'favorites',
		component: FavoritesPageComponent,
	},
	{
		path: 'history',
		component: HistoryPageComponent,
	},
	{
		path: '**',
		redirectTo: '',
	},
];
