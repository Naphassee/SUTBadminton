const Tournament = require('../models/Tournament');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const tours = await Tournament.find();
        res.json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
      tourName, tourTagline, deadlineOfRegister, startTour, endTour,
      locationName, province, district, subDistrict, detailLocation,
      types
    } = req.body;
    const promoteImage = req.file ? req.file.filename : null;
    const typesArray = JSON.parse(types);

    try {
        const newTour = new Tournament({
            promoteImage,
            tourName, tourTagline, deadlineOfRegister, startTour, endTour,
            locationName, province, district, subDistrict, detailLocation,
            types: typesArray
        });

        await newTour.save();
        res.status(201).json(newTour);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
}