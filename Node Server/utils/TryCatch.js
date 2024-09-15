export function TryCatch(fun) {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  };
}
