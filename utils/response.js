export const sendSuccess = (res, payload, token, message, status) => {
  const response = {
    success: true,
    message,
    data: payload,
  };

  if (token) {
    response.token = token; // Add the token key only if the token is provided
  }

  return res.status(status).json(response);
};

export const sendError = (res, message, status) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
