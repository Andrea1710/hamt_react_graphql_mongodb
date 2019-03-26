import React from "react";

export default React.createContext({
  username: null,
  token: null,
  userId: null,
  login: (user, token, userId, tokenExpiration) => {},
  logout: () => {}
});
