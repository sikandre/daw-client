import Cookies from 'universal-cookie';
const cookies = new Cookies();

const config = {
  baseHost: 'http://localhost:8082',
  version: '/api/v0',
};

const getUser = () => {
  return cookies.get('user');
};

function UriManager() {
  const baseUri = `${config.baseHost}`;
  this.login = (credentials) => `${baseUri}/login?user=${credentials}`;
  this.signup = () => `${baseUri}/signup`;
  this.projects = () => `${baseUri}${config.version}/projects?page=1&size=1`;
  this.projectsChangePage = (url) => `${baseUri}${config.version}${url}&size=1`;
  this.projectDetails = (pName) =>
    `${baseUri}${config.version}/projects/${pName}`;
  this.genericRequest = (uri) => `${baseUri}${config.version}${uri}`;
  this.templateRequestUri = () => `${baseUri}${config.version}/uriTemplate`;
}

let base64 = require('base-64');
const uriManager = new UriManager();

export const loginRequest = async (username, password) => {
  const credentials = base64.encode(`${username}:${password}`);
  const uri = uriManager.login(credentials);
  const response = await fetch(uri);

  if (response.status !== 200) {
    const data = await response.json();
    throw new Error(data.title);
  }
};

export const signupRequest = async (user) => {
  const uri = uriManager.signup();
  const body = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  const response = await fetch(uri, body);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.title);
  }
};

export const templateRequest = async () => {
  const user = getUser();
  const uri = uriManager.templateRequestUri();

  const credentials = base64.encode(`${user.username}:${user.password}`);

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  };
  const response = await fetch(uri, headers);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.title);
  }

  return await response.json();
};

export const genericRequest = async (url) => {
  const user = getUser();
  if (!user) {
    return;
  }
  const uri = uriManager.genericRequest(url);
  const credentials = base64.encode(`${user.username}:${user.password}`);

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  };
  const response = await fetch(uri, headers);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.title);
  }

  return await response.json();
};

export const genericPostRequest = async (url, payload) => {
  const user = getUser();

  const credentials = base64.encode(`${user.username}:${user.password}`);

  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(payload),
  };

  return generic(url, headers);
};

export const genericPutRequest = async (url, payload) => {
  const user = getUser();
  const credentials = base64.encode(`${user.username}:${user.password}`);

  const headers = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(payload),
  };
  return generic(url, headers);
};

const generic = async (url, headers) => {
  const uri = uriManager.genericRequest(url);

  const response = await fetch(uri, headers);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.title);
  }

  return await response.json();
};
