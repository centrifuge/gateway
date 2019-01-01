const API_BASE = '/api';

const baseUsersRoute = `${API_BASE}/users`;

const userRoutes = {
  base: baseUsersRoute,
  login: `${baseUsersRoute}/login`,
};

export const ROUTES = Object.freeze({
  API_BASE,
  INVOICES: `${API_BASE}/invoices`,
  USERS: userRoutes,
  CONTACTS: `${API_BASE}/contacts`,
  WEBHOOKS: `${API_BASE}/webhooks`,
});
