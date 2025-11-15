const attendanceService = require('../services/attendance.service');

async function create(req, res, next) {
  try {
    const attendance = await attendanceService.registerAttendance(req.body);
    return res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
}

async function index(req, res, next) {
  try {
    const list = await attendanceService.listAttendance();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.id);
    return res.status(200).json(attendance);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
    return res.status(200).json(attendance);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const response = await attendanceService.deleteAttendance(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, index, show, update, remove };
