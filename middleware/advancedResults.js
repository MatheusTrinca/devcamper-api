const { model } = require("../models/Course")

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = {...req.query}

  //Fileds to exclude -> tudo que não quer que selecione como campo do DB
  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach(param => delete reqQuery[param]);


  let queryStr = JSON.stringify(reqQuery); // transformar em string para usar o replac3e
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  // adicionado average cost no DB
  // O in é contem, exemplo no careers
  // O espaço na URL é '%20'
  
  query = model.find(JSON.parse(queryStr))

  //Select fields
  if(req.query.select){
    const fields = req.query.select.replace(',', ' ');
    query = query.select(fields);
  }

  // Sort By
  if(req.query.sort){
    const sortBy = req.query.sort.replace(',', ' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt') // esse '-' indica do mais recente primeiro
  }

  // Pagination
  const page = parseInt(req.query.page, 20) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  
  query = query.skip(startIndex).limit(limit);

  if(populate) {
    query = query.populate(populate);
  }

  const results = await query;

  //Pagination results
  const pagination = {}
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }
  next()
}

module.exports = advancedResults;