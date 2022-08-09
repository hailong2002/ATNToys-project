var express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})
//duong dan den database
var url = 'mongodb+srv://hailong:hailong2002@cluster0.8pjswus.mongodb.net/test'
//import thu vien MongoDB
var MongoClient = require('mongodb').MongoClient;

app.post('/editProduct', async (req, res) => {
    let id = req.body._id
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picURL = req.body.txtPicture
    if (name.length <= 2) {
        res.render('createProduct', { 'nameError': 'Name cannot be less than 5 character !' })
        return
    }
    if(price <= 0)
    {
        res.render('createProduct', { 'priceError': 'Price cannot be equal or less than 0 !' })
        return
    }
    if(picURL.length <= 0)
    {
        res.render('createProduct', { 'pictureError': 'URL of picture cannot be empty !' })
        return
    }
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys")
    await dbo.collection("product").updateOne({ _id:ObjectId(id) }, {
        $set:
            { 'name': name, 'price': price, 'picURL': picURL }
    })
    res.redirect('/viewAll')

})

app.get('/edit', async (req, res) => {
    let id = req.query.id
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve product co id nguoi dung can Edit
    let product = await dbo.collection("product").findOne({ _id: ObjectId(id) })
    //console.log(product)
    res.render('edit', { 'product': product })
})

app.get('/sortAscend', async (req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let products = await dbo.collection("product").find().sort({price:1}).toArray()
    res.render('allProduct', { 'products': products })
})

app.get('/sortDescend', async (req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let products = await dbo.collection("product").find().sort({price:-1}).toArray()
    res.render('allProduct', { 'products': products })
})

app.get('/delete', async (req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let deleteProduct = await dbo.collection("product").deleteOne({ _id: ObjectId(id) })
    let products = await dbo.collection("product").find().toArray()
    res.render('allProduct', { 'products': products })
})


app.post('/search', async (req, res) => {
    let nameSearch = req.body.txtName
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let products = await dbo.collection("product").find({ $or: [{ 'name': new RegExp(nameSearch, 'i') }, { _id: nameSearch }] }).toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('allProduct', { 'products': products })
})

app.get('/viewAll', async (req, res) => {
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let products = await dbo.collection("product").find().toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('allProduct', { 'products': products })
})

app.post('/createProduct', async (req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picURL = req.body.txtPicture
    if (name.length <= 2) {
        res.render('createProduct', { 'nameError': 'Name cannot be less than 5 character !' })
        return
    }
    if(price <= 0)
    {
        res.render('createProduct', { 'priceError': 'Price cannot be equal or less than 0 !' })
        return
    }
    if(picURL.length <= 0)
    {
        res.render('createProduct', { 'pictureError': 'URL of picture cannot be empty !' })
        return
    }
    let product = {
        'name': name,
        'price': price,
        'picURL': picURL
    }
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //3.insert product vao database ATNToys, trong table product
    await dbo.collection("product").insertOne(product);
    res.redirect('/viewAll')
})

app.get('/create', (req, res) => {
    res.render('createProduct')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")