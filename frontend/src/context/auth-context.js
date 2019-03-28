import React from "react";

export default React.createContext({
  username: null,
  email: null,
  tokenExpiration: null,
  token: null,
  userId: null,
  login: (user, token, userId, tokenExpiration) => {},
  logout: () => {}
});
