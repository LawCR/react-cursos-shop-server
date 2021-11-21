const Course = require("../models/course");

// Controlador para crear un nuevo curso
const addCourse = (req, res) => {
    const body = req.body
    const course = new Course(body)
    course.order = 1000

    course.save((err, courseStored) => {
        if (err) {
            res.status(400).send({code: 400, message: "The course you are creating already exists"})
        } else {
            if (!courseStored) {
                res.status(400).send({code: 400, message: "Course creation failed, try again later"})
            } else {
                res.status(200).send({code:200, message:"Curso created successfully"})
            }
        }
    })
}

// Controlador para obtener todos los cursos
const getCourses = (req, res) => {
    Course.find()
        .sort({order: "asc"})
        .exec( (err, coursesStored) => {
            if (err) {
                res.status(500).send({code:500, message:"Server error, try again later"})
            } else {
                if (!coursesStored) {
                    res.status(404).send({code:404, message:"Courses not found"})
                } else {
                    res.status(200).send({code: 200, courses: coursesStored})
                }
            }
        })
}

// Controlador para eliminar curso
const deleteCourse = (req, res) => {
    const {id} = req.params
    Course.findByIdAndDelete(id, (err, courseDeleted) => {
        if (err) {
            res.status(500).send({code:500, message:"Server error, try again laterdd"})
        } else {
            if (!courseDeleted) {
                res.status(404).send({code:404, message:"Course not found"})
            } else {
                res.status(200).send({code: 200, message:"Course removed successfully"})
            }
        }
    })
    
}

//
const updateCourse = (req, res) => {
    const {id} = req.params
    const courseData = req.body
    
    Course.findByIdAndUpdate(id, courseData, (err, courseUpdated) => {
        if (err) {
            res.status(500).send({code: 500, message: "Server error, try again later"})
        } else {
            if (!courseUpdated) {
                res.status(404).send({code: 404, message: "Course not found"})
            } else {
                res.status(200).send({code: 200, message: "Course updated successfully"})
            }
        }
    })
}

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse
}