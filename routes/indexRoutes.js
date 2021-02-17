var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    router.get("/", function(req, res){
      res.redirect("/home");
  })

router.get("/register", function(req,res){
  res.render("register");
});
// SIGN UP LOGIC
router.post("/register", function(req,res){
  const { name,username,accountNo,ifsc,balance} = req.body;
  var newUser = new User({name:name,username:username,accountNo:accountNo,ifsc:ifsc,balance:balance,transactions:[]});
  User.register(newUser, req.body.password, function(err,user){
    if (err) {
      console.log(err);
      return res.render("register");
      
    } 
      passport.authenticate("local")(req,res,function(){
        res.redirect("/home");
      })
    
  });
});


router.get("/login", function(req, res){
  res.render("login");
})
router.get("/", function(req, res){
  res.render("login");
})
// HANDLING  LOGIN LOGIC

router.post("/login", passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/login",
  failureflash:true
}));

// LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();

  res.redirect("/login");
})



module.exports = router;

