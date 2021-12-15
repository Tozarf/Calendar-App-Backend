// User routes / Auth
// host + /api/auth
const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, userLogin, tokenRefresh } = require("../controllers/auth");
const { fieldValidation } = require("../middlewares/fieldValidators");
const { jwtValidation } = require("../middlewares/jwtValidation");
const router = Router();

router.post(
    "/new",
    [
        check("name", "Name is a required field").not().isEmpty(),
        check("email", "Email is a required field").isEmail(),
        check("password", "Password must have at least 6 characters").isLength({
            min: 6,
        }),
        fieldValidation,
    ],
    createUser
);

router.post(
    "/",
    [
        check("email", "Email is a required field").isEmail(),
        check("password", "Password must have at least 6 characters").isLength({
            min: 6,
        }),
        fieldValidation,
    ],
    userLogin
);

router.get("/refresh", jwtValidation, tokenRefresh);

module.exports = router;
