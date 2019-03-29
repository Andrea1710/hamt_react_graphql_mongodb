import React from "react";

export default React.createContext({
  username: null,
  email: null,
  plan: null,
  planExpiration: null,
  tokenExpiration: null,
  token: null,
  userId: null,
  login: (user, token, userId, tokenExpiration) => {},
  logout: () => {}
});
