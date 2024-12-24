const handleSaveError = (
  error: { name: string; code: number; status?: number },
  data: unknown,
  next: Function
) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  if (next) next();
};

export default handleSaveError;
