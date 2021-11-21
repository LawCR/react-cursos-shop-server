require('dotenv').config();
const mongoose = require("mongoose")
const app = require("./app")
const PORT_SERVER = process.env.PORT || 8081
const { API_VERSION, IP_SERVER, PORT_DB, DB} = require("./config")

// const DB_URL = `mongodb://${IP_SERVER}:${PORT_DB}/${DB}`
const DB_URL = `mongodb+srv://alvaro2:alvaro123@webpersonalcourses.yokk7.mongodb.net/WebPersonalCourses?retryWrites=true&w=majority`
const SERVER_URL = `http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}/`

mongoose.connect(DB_URL,
    {useNewUrlParser:true},
    (err,res)=>{
        if (err) {
            throw err;
        } else {
            console.log("La conexion a la base de datos es correcta.");
            app.listen(PORT_SERVER, () => {
                console.log("#####################");
                console.log("###### API REST #####");
                console.log("#####################");
                console.log(SERVER_URL)
            })
        }
    }
    )