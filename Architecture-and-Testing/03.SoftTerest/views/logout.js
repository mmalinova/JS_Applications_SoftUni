import { logout } from '../src/api/api.js';

export async function setupLogout(navigation) {
    await logout();

    navigation.setUserNavigation();
    navigation.goTo('home');
}