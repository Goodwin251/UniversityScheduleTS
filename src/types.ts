
// Дні тижня
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// Часові слоти
export type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

// Типи занять
export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Професор
export type Professor = {
    id: number;
    name: string;
    department: string;
};

// Аудиторія
export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

// Курс
export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// Заняття
export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict" | "CourseIdConflict";
    lessonDetails: Lesson;
};