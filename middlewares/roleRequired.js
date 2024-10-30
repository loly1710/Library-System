function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.type !== role) {
      return res.redirect("/");
    }
    next();
  };
}

module.exports = { requireRole };
