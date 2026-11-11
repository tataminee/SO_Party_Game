const KEY = "kca_user";

export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const saveUser = (u) => sessionStorage.setItem(KEY, JSON.stringify(u));