const {Company, validate} = require('../db/models/company')
const {Trade} = require('../db/models/trade')
const mongoose = require('mongoose');

const _ = require('lodash')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const {currentPage, companiesLimit} = req.query
  const companies = (currentPage && companiesLimit)
      ? await Company.find()
          .populate('employees')
          .sort('name')
          // .skip((+currentPage - 1) * (+companiesLimit)).limit(+companiesLimit)
      : await Company.find()
          .populate('employees')
          .sort('name')
  const companiesLength = await Company.find().count()
  // setTimeout(() => res.send({companies, companiesLength, currentPage}), 500)
  res.send({companies, companiesLength, currentPage});
})

router.get('/:id', [auth], async (req, res) => {
  const company = await Company
      .findById(req.params.id)
      .populate('employees')

  if (!company) return res.status(404).send({code: 4032, message: 'The company with the given ID was not found.'})
  // setTimeout(()=>res.send({company}), 500)
  res.send(company)
})

router.post('/', async (req, res) => {
  const {error} = validate(req.body)
  if (error) return res.status(400).send({code: 4020, message: error.details[0].message})

  const company = new Company({
    mainInfo: req.body.mainInfo,
    administratorInfo: req.body.administratorInfo,
  })
  await company.save()

  // setTimeout(() => res.send(company), 500)
  res.send(company);
})

router.put('/:id', async (req, res) => {
  const {error} = validate(_.pick(req.body, ['mainInfo', 'administratorInfo']))
  if (error) return res.status(400).send({code: 4021, message: error.details[0].message})

  const company = await Company.findByIdAndUpdate(req.params.id,
      {
        mainInfo: req.body.mainInfo,
        administratorInfo: req.body.administratorInfo,
      }, {new: true})

  if (!company) return res.status(404).send('The company with the given ID was not found.')

  res.send(company)
})

router.delete('/:id', async (req, res) => {

  const tradesCount = await Trade.find({shippingBlocks: {$elemMatch: {company: mongoose.Types.ObjectId(req.params.id)}}}).count()

  if (tradesCount > 0) {
    const company = await Company.findById(req.params.id)
    return res.status(400).send({code: 4042, company})
  }

  const company = await Company
      .findById(req.params.id)
      .populate('employees')

  await Promise.all(company.employees.map(employee => employee.remove()))
  await company.remove()

  if (!company) return res.status(404).send('The company with the given ID was not found.')

  // setTimeout(() => res.send(company), 500)
  res.send(company)
})

module.exports = router
