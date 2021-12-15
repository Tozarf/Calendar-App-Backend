// Event routes
// host + /api/events

const { Router } = require("express");
const { check } = require("express-validator");
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { fieldValidation } = require("../middlewares/fieldValidators");
const { jwtValidation } = require("../middlewares/jwtValidation");

const router = Router();
//token validation, all routes affected
router.use(jwtValidation);

//obtaining events
router.get(
    "/",

    getEvents
);

//creating events
router.post(
    "/",
    [
        check("title", "Title is a required field").not().isEmpty(),
        check("start", "Start date is a required field").custom(isDate),
        check("end", "End date is a required field").custom(isDate),
        fieldValidation,
    ],
    createEvent
);

//update events
router.put(
    "/:id",
    [
        check("title", "Title is a required field").not().isEmpty(),
        check("start", "Start date is a required field").custom(isDate),
        check("end", "End date is a required field").custom(isDate),
        fieldValidation,
    ],
    updateEvent
);

//delete events
router.delete("/:id", deleteEvent);

module.exports = router;
