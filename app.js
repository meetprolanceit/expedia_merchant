const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});

app.use('/api/v1', require('./routes/auth.router'));
