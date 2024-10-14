export class UniSchedule {
    // Масиви даних
    professors;
    classrooms;
    courses;
    schedule;
    constructor() {
        this.professors = [];
        this.classrooms = [];
        this.courses = [];
        this.schedule = [];
    }
    validateLesson(lesson) {
        // Перевірка на конфлікт з професором
        const professorConflict = this.schedule.find((l) => l.professorId === lesson.professorId &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot);
        if (professorConflict) {
            return { type: "ProfessorConflict", lessonDetails: professorConflict };
        }
        // Перевірка на конфлікт з аудиторією
        const classroomConflict = this.schedule.find((l) => l.classroomNumber === lesson.classroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot);
        if (classroomConflict) {
            return { type: "ClassroomConflict", lessonDetails: classroomConflict };
        }
        // Перевірка на існування пари в розкладі
        const courseIdConflict = this.schedule.find((l) => l.courseId == lesson.courseId);
        if (courseIdConflict) {
            return { type: "CourseIdConflict", lessonDetails: courseIdConflict };
        }
        return null;
    }
    // Додавання професора
    addProfessor(professor) {
        this.professors.push(professor);
    }
    // Додавання заняття
    addLesson(lesson) {
        if (this.validateLesson(lesson) === null) {
            this.schedule.push(lesson);
            return true;
        }
        return false;
    }
    // Зміна аудиторії для заняття
    reassignClassroom(lessonId, newClassroomNumber) {
        const lesson = this.schedule.find((lesson) => lesson.courseId === lessonId);
        if (lesson &&
            !this.schedule.find((l) => l.classroomNumber === newClassroomNumber &&
                l.timeSlot === lesson.timeSlot &&
                l.dayOfWeek === lesson.dayOfWeek)) {
            lesson.classroomNumber = newClassroomNumber;
            return true;
        }
        return false;
    }
    // Скасування заняття
    cancelLesson(lessonId) {
        this.schedule = this.schedule.filter((lesson) => lesson.courseId !== lessonId);
    }
    // Пошук вільних аудиторій
    findAvailableClassrooms(timeSlot, dayOfWeek) {
        const occupiedClassrooms = this.schedule
            .filter((lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
            .map((lesson) => lesson.classroomNumber);
        return this.classrooms
            .filter((classroom) => !occupiedClassrooms.includes(classroom.number))
            .map((classroom) => classroom.number);
    }
    // Розклад професора
    getProfessorSchedule(professorId) {
        return this.schedule.filter((lesson) => lesson.professorId === professorId);
    }
    // Використання аудиторії
    getClassroomUtilization(classroomNumber) {
        const totalSlots = 5 * 5; // Кількість можливих часових слотів протягом тижня
        const usedSlots = this.schedule.filter((lesson) => lesson.classroomNumber === classroomNumber).length;
        return (usedSlots / totalSlots) * 100;
    }
    // Найпопулярніший тип занять
    getMostPopularCourseType() {
        const courseTypes = this.courses.reduce((acc, course) => {
            acc[course.type] = (acc[course.type] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(courseTypes).reduce((max, [type, count]) => {
            return count > max.count ? { type, count } : max;
        }, { type: "Lecture", count: 0 }).type;
    }
}
