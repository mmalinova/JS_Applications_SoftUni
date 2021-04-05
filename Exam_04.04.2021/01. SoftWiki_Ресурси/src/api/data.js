import * as api from './api.js';

const host = 'http://localhost:3030';

api.settings.host = host;

export const register = api.register;
export const login = api.login;
export const logout = api.logout;

export async function getArticles() {
    return await api.get(host + '/data/wiki?sortBy=_createdOn%20desc');
}

export async function getArticleById(id) { 
    return await api.get(host + '/data/wiki/' + id);
}

export async function getRecent() { 
    return await api.get(host + '/data/wiki?sortBy=_createdOn%20desc&distinct=category');
}

export async function createArticle(data) { 
    return await api.post(host + '/data/wiki', data);
}

export async function editArticleById(id ,data) { 
    return await api.put(host + '/data/wiki/' + id, data);
}

export async function deleteArticleById(id) { 
    return await api.del(host + '/data/wiki/' + id);
}

export async function searchByTitle(query) {
    return await api.get(host + `/data/wiki?where=title%20LIKE%20%22${query}%22`);
}