const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 5001

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
