const { Router } = require('express')
const { addCourse, getCourses, deleteCourse, updateCourse } = require('../controllers/course')
const { ensureAuth } = require('../middleware/authenticated')
const router = Router()

router.post('/add-course', [ensureAuth], addCourse)

router.get('/get-courses', getCourses)

router.delete('/delete-course/:id', [ensureAuth], deleteCourse)

router.put('/update-course/:id', [ensureAuth], updateCourse)

module.exports = router