// @desc    Show all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res) => {
  res.status(200).json({success: true, msg: 'Showing all bootcamps' , hello: req.hello});
}

// @desc    Show single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp = (req, res) => {
  res.status(200).json({success: true, msg: `Showing bootcamp id: ${req.params.id}`});
}

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = (req, res) => {
  res.status(201).json({success: true, msg: 'Saving a new bootcamp'});
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamp/:id
// @access  Private
exports.updateBootcamp = (req, res) => {
  res.status(200).json({success: true, msg: `Updating bootcamp id: ${req.params.id}`});
}
// @desc    Show all bootcamps
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = (req, res) => {
  res.status(200).json({success: true, msg: `Deleting bootcamp id: ${req.params.id}`});
}