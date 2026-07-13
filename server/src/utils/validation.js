// check username valid or not
export const isValidUsername = (username) => {
  const usernameRegex = /^(?=.{3,26}$)(?=.*[A-Za-z])[A-Za-z][A-Za-z0-9]*$/;
  return usernameRegex.test(username);
};
// check email is valid or not
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};
// check password is valid or not
export const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  return passwordRegex.test(password);
};
