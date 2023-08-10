exports.getMongooseErrors = (err) => {
  return {
    message: Object.values(err.errors)
      .map((err) => err.message)
      .join('\n'),
  };
};
