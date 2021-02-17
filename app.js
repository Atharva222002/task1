
var express      = require("express"),
        app      = express(),
        mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport       = require("passport"),
  LocalStrategy  = require("passport-local"),
        // seedDB   = require("./seeds"),
            User = require("./models/user"),
      middleware = require("./middleware");

const user = require("./models/user");
const { all } = require("./routes/indexRoutes");
 var indexRoutes = require("./routes/indexRoutes");       

app.use( express.static( "public" ) );
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://pass-12:pass-12@bankdb-shard-00-00.huswf.mongodb.net:27017,bankdb-shard-00-01.huswf.mongodb.net:27017,bankdb-shard-00-02.huswf.mongodb.net:27017/safeBank?ssl=true&replicaSet=atlas-12jpfc-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// seedDB();

app.use(require("express-session")({
    secret:"Once again, Rusty wins cutest dog",
    resave:false,
    saveUninitialized:false
  }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "public"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
   
    next();
  });


app.use("/",indexRoutes);

app.get('/home',middleware.isLoggedIn,(req,res)=>{
    res.render("home",{user:req.user})
  })

app.post('/send',middleware.isLoggedIn,(req,res)=>{
    if(req.user.balance<parseInt(req.body.paisa)){
        res.status(201).render('new', { isAdded : false } );
    }
    else{
        User.findOne({name:req.body.name},(err,user1)=>{
            const paisa=parseInt(req.body.paisa)
            user1.balance=user1.balance+paisa
            req.user.balance=req.user.balance-paisa
            console.log(user1.balance)
            console.log(req.user.balance)
            date=new Date()
            msg1="You have received "+paisa+" rupees from "+req.user.username+" on "+date
            msg2="You have paid "+paisa+" rupees to "+user1.username+" on "+date
            user1.transactions.push(msg1)
            req.user.transactions.push(msg2)
            user1.save()
            req.user.save()
            res.status(201).render('new', { isAdded : true } );
        })
    }

  })

app.get("/customers",middleware.isLoggedIn,function(req, res){
    User.find({}, function(err,allusers){
        if (err) {
            console.log(err);
        } else {
           // console.log(allquestions);
           const itemToBeRemoved = {name:req.user.name}
           allusers.splice(allusers.findIndex(a => a.name === itemToBeRemoved.name) , 1)
           res.render("customers", {users:allusers});
        }
      
    });

});

app.get("/history/:id",function(req, res){
    User.findById(req.params.id).exec( function(err, founduser){
        if (err) {
            console.log(err);
            res.redirect("/home");
        } else {
            console.log(founduser)
            res.render("history",{msgs:founduser.transactions});
        }
 })   
});

app.get("/customers/:id",function(req, res){
    User.findById(req.params.id).exec( function(err, founduser){
        if (err) {
            console.log(err);
            res.redirect("/customers");
        } else {
            res.render("show1",{user:founduser});
        }
 })    
});

app.get("/profile/:id",function(req, res){
    User.findById(req.params.id).exec( function(err, founduser){
        if (err) {
            console.log(err);
            res.redirect("/home");
        } else {
            res.render("show2",{user:founduser});
        }
 })    
});

app.get("/customer/:id/pay",function(req, res){
    User.findById(req.params.id).exec( function(err, founduser){
        if (err) {
            console.log(err);
            res.redirect("/send");
        } else {
            res.render("send",{user:founduser});
        }
 })    
});
app.listen(process.env.PORT || 80, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });