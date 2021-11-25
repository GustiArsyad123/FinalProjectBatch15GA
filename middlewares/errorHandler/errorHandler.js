module.exports = (err, req, res, next) => {
    let errors = new Error();
    errors.status = 404;
    next(err)
};