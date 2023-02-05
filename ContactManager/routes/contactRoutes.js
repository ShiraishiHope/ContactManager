const express = require("express");
const router = express.Router();
const Contact = require ("../models/contact");
const mongoose = require("mongoose");

//http://localhost:8080
router.route("/")
  .get((req,res) => {
    Contact.find()
      .then((data) => res.render("home", { contact: data }))
      .catch((error) => res.status(400).json(error));
  });

// http://localhost:8080/contact/new
router.route("/contact/new")
  .get((req, res) => {
    res.render("add-contact",
    {
      error:""
    });
  })
  .post((req, res) => {
    let error = []; 
    let errorCounter=0;
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const phoneRegex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
    if (req.body.firstName == ""){
        error[errorCounter] = "Le champ prénom n'est pas renseigné ";
        errorCounter++;
    }

    if (req.body.lastName == ""){
        error[errorCounter] = "Le champ nom n'est pas renseigné";
        errorCounter++;
    }

    if (req.body.company == ""){
        error[errorCounter] = "Le champ société n'est pas renseigné" ;
        errorCounter++;
    }

    if (req.body.adress == ""){
        error[errorCounter] = "Le champ adresse n'est pas renseigné" ;
        errorCounter++;
    }
    if (req.body.phone == ""){
      error[errorCounter] = "Le champ tel n'est pas renseigné" ;
      errorCounter++;
  } else if (phoneRegex.test(req.body.phone) == false){
    error[errorCounter] = "Telephone format non valide" ;
    errorCounter++;
}

  if (req.body.email == ""){
      error[errorCounter] = "Le champ email n'est pas renseigné" ;
      errorCounter++;
  } else if (emailRegex.test(req.body.email) == false){
    error[errorCounter] = "Email format non valide" ;
    errorCounter++;
}

    if (req.body.secteur == ""){
        error[errorCounter] += "Le champ secteur n'est pas renseigné" ;
        errorCounter++;
    }

    if (error != ""){
        res.render("add-contact", {
            error: error,
            errorCounter:errorCounter
        })
    } else {
      console.log(req.body.status);
      if (req.body.status == undefined){
        req.body.status = false
      }
    const newContact = new Contact(req.body);
    newContact
        .save()
        .then((data)=> res.redirect("/"))
        .catch((error) => res.status(400).json(error));
    }
});

// http://localhost:8080/contact/edit/:id
router.route("/contact/edit/:id")
  .get((req, res) => {
    Contact.findById(req.params.id, function (err, contact) {
      if (err) {
        return res.status(400).json(err);
      }
      if (!contact) {
      return res.status(404).json({message: "Contact not found"});
      }
        res.render('edit-contact',{
          contact: contact,
          error:"",
          id: req.params.id
        });
      });
    })
.post((req, res) => {
  const id = req.body.id;
  const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const phoneRegex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
  console.log(id);
  console.log(emailRegex.test(req.body.email));
    let error = []; 
    let errorCounter=0;
    if (req.body.firstName == ""){
        error[errorCounter] = "Le champ prénom n'est pas renseigné ";
        errorCounter++;
    }

    if (req.body.lastName == ""){
        error[errorCounter] = "Le champ nom n'est pas renseigné";
        errorCounter++;
    }

    if (req.body.company == ""){
        error[errorCounter] = "Le champ société n'est pas renseigné" ;
        errorCounter++;
    }

    if (req.body.adress == ""){
        error[errorCounter] = "Le champ adresse n'est pas renseigné" ;
        errorCounter++;
    }

    if (req.body.phone == ""){
        error[errorCounter] = "Le champ tel n'est pas renseigné" ;
        errorCounter++;
    } else if (phoneRegex.test(req.body.phone) == false){
      error[errorCounter] = "Telephone format non valide" ;
      errorCounter++;
  }

    if (req.body.email == ""){
        error[errorCounter] = "Le champ email n'est pas renseigné" ;
        errorCounter++;
    } else if (emailRegex.test(req.body.email) == false){
      error[errorCounter] = "Email format non valide" ;
      errorCounter++;
  }

    if (req.body.secteur == ""){
        error[errorCounter] += "Le champ secteur n'est pas renseigné" ;
        errorCounter++;
    }
    if (error.length >0){
      res.render("edit-contact", {
          error: error,
          contact: {
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            company: req.body.company,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            sector: req.body.sector,
            id: id
          },
          errorCounter:errorCounter,
          id: id
      });
  } else {
   
  Contact.findByIdAndUpdate(id, {
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    company: req.body.company,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    sector: req.body.sector,
    id: id
  },)
  .then((data) => {
  res.redirect("/");
  console.log(data);
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json(error)
  })
}});

  router.route("/contact/delete/:id")
  .get((req, res) => {
    Contact.findByIdAndDelete(req.params.id)
    .then((data) => res.redirect("/"))
    .catch((error) => res.status(400).json(error))
  })
  .post((req, res) => {
    Contact.findByIdAndDelete()
    .then((data) => res.redirect("/"))
    .catch((error) => res.status(400).json(error))
  });

  module.exports = router;