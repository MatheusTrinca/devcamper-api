const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc    Show all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  res.status(200).json(res.advancedResults);
});

// @desc    Show single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true, 
    data: bootcamp
  });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamp/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({success: true, data: bootcamp});
});

// @desc    Show all bootcamps
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  }
  bootcamp.remove();
  res.status(200).json({success: true, data: {}})
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {zipcode, distance} = req.params;
  
  //Get Lat and Long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Dividir a distancia passada pelo raio da Terra (radianos)
  // Raio da Terra em mihas é 3963
  const radius = distance / 3963;
  
  const bootcamps = await Bootcamp.find({
    location: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  }
  if(!req.files){
    return next(new ErrorResponse('Please upload a file', 400))
  }

  const file = req.files.file;

  // Check if is a photo
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse('Please upload image file', 400))
  }

  // Check file size
  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload image less than ${process.env.MAX_FILE_UPLOAD} Bytes`, 400))
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  
  // Move file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err){
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})

    res.status(200).json({
      success: true,
      data: file.name
    })
  })
});