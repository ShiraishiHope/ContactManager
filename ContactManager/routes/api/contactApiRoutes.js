const express = require("express");
const apiRouter = express.Router();
const Contact = require ("../../models/contact");
const mongoose = require("mongoose");

//route:localhost/api
apiRouter.route("/")
.get((req,res) => {
    Contact.find()
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json(error))
});

apiRouter.route("/contact/add")
    .post((req, res) => {
        const newContact = new Contact(req.body);
        newContact
            .save()
            .then((data)=> res.status(201).json(data))
            .catch((error) => res.status(400).json(error));
    });

//route: localhost/api/contact/:id
apiRouter.route("/contact/:id")
    .get((req,res) => {
        Contact.findById(req.params.id)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(400).json(error))
})
.put((req,res) => {
    Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json(error))
})
.delete((req,res) => {
    Contact.findByIdAndDelete(req.params.id)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json(error))
})



//export routes contained in the router
module.exports = apiRouter;
