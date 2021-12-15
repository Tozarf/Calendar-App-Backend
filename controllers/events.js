const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
    const events = await Event.find().populate("user", "name");

    res.status(201).json({
        ok: true,
        events,
    });
};

const createEvent = async (req, res = response) => {
    const event = new Event(req.body);
    try {
        event.user = req.uid;
        const savedEvent = await event.save();
        res.status(201).json({
            ok: true,
            event: savedEvent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please address the admin",
        });
    }
};

const updateEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event = await Event.findById(eventId);
        console.log(event);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "There are no matching events with that id",
            });
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "User does not have privileges to edit this event",
            });
        }
        const newEvent = {
            ...req.body,
            user: uid,
        };
        const eventUpdate = await Event.findByIdAndUpdate(eventId, newEvent, {
            new: true,
        });
        res.json({
            ok: true,
            event: eventUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please address the admin",
        });
    }
};

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "There are no matching events with that id",
            });
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "User does not have privileges to remove this event",
            });
        }

        const eventRevomal = await Event.findByIdAndRemove(eventId);
        res.json({
            ok: true,
            msg: "Event removed successfully",
            deletedEventId: eventRevomal.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please address the admin",
        });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
