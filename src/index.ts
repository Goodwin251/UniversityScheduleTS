import { UniSchedule } from "./schedule.js";
import {
  Professor,
  Classroom,
  Course,
  Lesson,
  DayOfWeek,
  TimeSlot,
  CourseType,
} from "./types.js";

const uniSchedule = new UniSchedule();

if (typeof window == "undefined") {
  // Додавання професорів
  const professor1: Professor = {
    id: 1,
    name: "Dr. Kovalenko",
    department: "Computer Science",
  };
  const professor2: Professor = {
    id: 2,
    name: "Prof. Johnsonuk",
    department: "Mathematics",
  };

  uniSchedule.addProfessor(professor1);
  uniSchedule.addProfessor(professor2);

  // Додавання аудиторій
  const classroom1: Classroom = {
    number: "101",
    capacity: 30,
    hasProjector: true,
  };
  const classroom2: Classroom = {
    number: "102",
    capacity: 25,
    hasProjector: false,
  };

  uniSchedule.classrooms.push(classroom1, classroom2);

  // Додавання курсів
  const course1: Course = {
    id: 1,
    name: "Introduction to Programming",
    type: "Lecture",
  };
  const course2: Course = {
    id: 2,
    name: "Advanced Mathematics",
    type: "Seminar",
  };

  uniSchedule.courses.push(course1, course2);

  // Додавання заняття
  const lesson1: Lesson = {
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
  };
  const lesson2: Lesson = {
    courseId: 2,
    professorId: 2,
    classroomNumber: "102",
    dayOfWeek: "Tuesday",
    timeSlot: "10:15-11:45",
  };

  const addedLesson1 = uniSchedule.addLesson(lesson1);
  const addedLesson2 = uniSchedule.addLesson(lesson2);

  console.log(`Lesson 1 added: ${addedLesson1}`); // true, якщо додано без конфліктів
  console.log(`Lesson 2 added: ${addedLesson2}`); // true

  // Отримання розкладу професора
  const professorSchedule = uniSchedule.getProfessorSchedule(1);
  console.log("Professor 1 Schedule:", professorSchedule);

  // Пошук вільних аудиторій
  const availableClassrooms = uniSchedule.findAvailableClassrooms(
    "8:30-10:00",
    "Monday",
  );
  console.log(
    "Available classrooms on Monday 8:30-10:00:",
    availableClassrooms,
  );

  // Використання аудиторії
  const utilization = uniSchedule.getClassroomUtilization("101");
  console.log("Classroom 101 utilization:", utilization);

  // Найпопулярніший тип курсу
  const popularCourseType = uniSchedule.getMostPopularCourseType();
  console.log("Most popular course type:", popularCourseType);

  // Зміна аудиторії
  const reassigned = uniSchedule.reassignClassroom(1, "102");
  console.log(`Reassigned lesson 1 to classroom 102: ${reassigned}`);

  // Скасування заняття
  uniSchedule.cancelLesson(1);
  console.log("Lesson 1 canceled.");

  // Перевірка розкладу після скасування
  const updatedSchedule = uniSchedule.getProfessorSchedule(1);
  console.log("Updated Professor 1 Schedule:", updatedSchedule);
} else {
  const documentRef =
    typeof document !== "undefined" ? document : new Document();

  // Оновлення таблиць після додавання нових даних
  function updateTables() {
    // Сортування розкладу за днем тижня і часом проведення
    const sortedSchedule = uniSchedule.schedule.sort((a, b) => {
      const dayOrder = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const dayComparison =
        dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);

      if (dayComparison !== 0) {
        return dayComparison;
      }

      return timeOrder[a.timeSlot] - timeOrder[b.timeSlot];
    });
    // Оновлення таблиці розкладу
    const scheduleTableBody = documentRef.querySelector(
      "#schedule-table tbody",
    ) as HTMLTableSectionElement;
    scheduleTableBody.innerHTML = ""; // Очищення таблиці
    sortedSchedule.forEach((lesson) => {
      const row = scheduleTableBody.insertRow();
      row.insertCell().textContent = lesson.courseId.toString();
      row.insertCell().textContent = lesson.professorId.toString();
      row.insertCell().textContent = lesson.classroomNumber;
      row.insertCell().textContent = lesson.dayOfWeek;
      row.insertCell().textContent = lesson.timeSlot;
      row.insertCell().textContent =
        uniSchedule.courses.find((course) => course.id === lesson.courseId)
          ?.type || "";
    });

    // Оновлення таблиці курсів
    const courseTableBody = documentRef.querySelector(
      "#course-table tbody",
    ) as HTMLTableSectionElement;
    courseTableBody.innerHTML = ""; // Очищення таблиці
    uniSchedule.courses.forEach((course) => {
      const row = courseTableBody.insertRow();
      row.insertCell().textContent = course.id.toString();
      row.insertCell().textContent = course.name;
      row.insertCell().textContent = course.type;
    });

    // Оновлення таблиці професорів
    const professorTableBody = documentRef.querySelector(
      "#professor-table tbody",
    ) as HTMLTableSectionElement;
    professorTableBody.innerHTML = ""; // Очищення таблиці
    uniSchedule.professors.forEach((professor) => {
      const row = professorTableBody.insertRow();
      row.insertCell().textContent = professor.id.toString();
      row.insertCell().textContent = professor.name;
      row.insertCell().textContent = professor.department;
    });

    // Оновлення таблиці аудиторій
    const classroomTableBody = documentRef.querySelector(
      "#classroom-table tbody",
    ) as HTMLTableSectionElement;
    classroomTableBody.innerHTML = ""; // Очищення таблиці
    uniSchedule.classrooms.forEach((classroom) => {
      const row = classroomTableBody.insertRow();
      row.insertCell().textContent = classroom.number;
      row.insertCell().textContent = classroom.capacity.toString();
      row.insertCell().textContent = classroom.hasProjector ? "Yes" : "No";
    });
  }

  const timeOrder: Record<TimeSlot, number> = {
    "8:30-10:00": 1,
    "10:15-11:45": 2,
    "12:15-13:45": 3,
    "14:00-15:30": 4,
    "15:45-17:15": 5,
  };

  // Оновлення списку професорів та аудиторій у формі додавання занять
  function updateProfessorAndClassroomSelection() {
    const professorSelect = documentRef.getElementById(
      "lesson-professor",
    ) as HTMLSelectElement;
    const classroomSelect = documentRef.getElementById(
      "lesson-classroom",
    ) as HTMLSelectElement;

    professorSelect.innerHTML = ""; // Очищення меню вибору професорів
    classroomSelect.innerHTML = ""; // Очищення меню вибору аудиторій

    uniSchedule.professors.forEach((professor) => {
      const option = documentRef.createElement("option");
      option.value = professor.id.toString();
      option.textContent = professor.name;
      professorSelect.appendChild(option);
    });

    uniSchedule.classrooms.forEach((classroom) => {
      const option = documentRef.createElement("option");
      option.value = classroom.number;
      option.textContent = classroom.number;
      classroomSelect.appendChild(option);
    });
  }

  // Оновлення списку курсів у формі додавання занять
  function updateCourseSelection() {
    const lessonCourseSelect = documentRef.getElementById(
      "lesson-course",
    ) as HTMLSelectElement;
    lessonCourseSelect.innerHTML = ""; // Очистити попередні опції

    uniSchedule.courses.forEach((course) => {
      const option = documentRef.createElement("option");
      option.value = course.id.toString();
      option.textContent = `${course.name} (${course.type})`;
      lessonCourseSelect.appendChild(option);
    });
  }

  // Обробник форми для додавання заняття
  const addLessonForm = documentRef.getElementById(
    "add-lesson-form",
  ) as HTMLFormElement;
  addLessonForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const courseId = +(
      documentRef.getElementById("lesson-course") as HTMLSelectElement
    ).value;
    const professorId = +(
      documentRef.getElementById("lesson-professor") as HTMLSelectElement
    ).value;
    const classroomNumber = (
      documentRef.getElementById("lesson-classroom") as HTMLSelectElement
    ).value;
    const dayOfWeek = (
      documentRef.getElementById("lesson-day") as HTMLSelectElement
    ).value as DayOfWeek;
    const timeSlot = (
      documentRef.getElementById("lesson-timeslot") as HTMLSelectElement
    ).value as TimeSlot;

    const lesson = {
      courseId,
      professorId,
      classroomNumber,
      dayOfWeek,
      timeSlot,
    };
    const added = uniSchedule.addLesson(lesson);
    if (!added) {
      alert("Конфлікт у розкладі! Перевірте дані.");
    } else {
      updateTables();
    }
  });

  // Обробник форми для додавання курсу
  const addCourseForm = documentRef.getElementById(
    "add-course-form",
  ) as HTMLFormElement;
  addCourseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = (documentRef.getElementById("course-name") as HTMLInputElement)
      .value;
    const type = (
      documentRef.getElementById("course-type") as HTMLSelectElement
    ).value as CourseType;

    const course = { id: Date.now(), name, type };
    uniSchedule.courses.push(course);
    updateTables();
    updateCourseSelection(); // Оновлення вибору курсів після додавання
  });

  // Обробник форми для додавання професора
  const addProfessorForm = documentRef.getElementById(
    "add-professor-form",
  ) as HTMLFormElement;
  addProfessorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = +(
      documentRef.getElementById("professor-id-input") as HTMLInputElement
    ).value;
    const name = (
      documentRef.getElementById("professor-name") as HTMLInputElement
    ).value;
    const department = (
      documentRef.getElementById("professor-department") as HTMLInputElement
    ).value;

    const professor = { id, name, department };
    uniSchedule.addProfessor(professor);
    updateTables();
    updateProfessorAndClassroomSelection(); // Оновлення вибору професорів після додавання
  });

  // Обробник форми для додавання аудиторії
  const addClassroomForm = documentRef.getElementById(
    "add-classroom-form",
  ) as HTMLFormElement;
  addClassroomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = (
      documentRef.getElementById("classroom-number") as HTMLInputElement
    ).value;
    const capacity = +(
      documentRef.getElementById("classroom-capacity") as HTMLInputElement
    ).value;
    const hasProjector = (
      documentRef.getElementById("classroom-projector") as HTMLInputElement
    ).checked;

    const classroom = { number, capacity, hasProjector };

    const same = uniSchedule.classrooms.find(
      (classr) => classr.number === classroom.number,
    );

    if (same) {
      alert(`Кабінет ${classroom.number} вже існує!`);
    } else {
      uniSchedule.classrooms.push(classroom);
      updateTables();
      updateProfessorAndClassroomSelection(); // Оновлення вибору аудиторій після додавання
    }
  });

  // Отримати використання аудиторії
  documentRef
    .getElementById("get-utilization-button")!
    .addEventListener("click", () => {
      const classroomNumber = (
        documentRef.getElementById(
          "classroom-utilization-number",
        ) as HTMLInputElement
      ).value;
      const utilization: number =
        uniSchedule.getClassroomUtilization(classroomNumber);
      documentRef.getElementById("utilization-result")!.textContent =
        `Використання аудиторії ${classroomNumber}: ${utilization.toFixed(2)}%`;
    });

  // Отримати найпопулярніший тип курсу
  documentRef
    .getElementById("get-popular-course-button")!
    .addEventListener("click", () => {
      const popularCourseType: CourseType =
        uniSchedule.getMostPopularCourseType();
      documentRef.getElementById("popular-course-result")!.textContent =
        `Найпопулярніший тип курсу: ${popularCourseType}`;
    });

  // Перенести заняття
  documentRef
    .getElementById("reassign-classroom-button")!
    .addEventListener("click", () => {
      const lessonId: number = +(
        documentRef.getElementById("lesson-id") as HTMLInputElement
      ).value;
      const newClassroomNumber: string = (
        documentRef.getElementById("new-classroom") as HTMLInputElement
      ).value;
      const success: boolean = uniSchedule.reassignClassroom(
        lessonId,
        newClassroomNumber,
      );
      documentRef.getElementById("reassign-result")!.textContent = success
        ? "Заняття перенесено."
        : "Не вдалося перенести заняття.";
      updateTables();
    });

  // Скасувати заняття
  documentRef
    .getElementById("cancel-lesson-button")!
    .addEventListener("click", () => {
      const lessonId: number = +(
        documentRef.getElementById("cancel-lesson-id") as HTMLInputElement
      ).value;
      uniSchedule.cancelLesson(lessonId);
      documentRef.getElementById("cancel-result")!.textContent =
        "Заняття скасовано.";
      updateTables();
    });

  // Пошук вільних аудиторій
  documentRef
    .getElementById("find-available-classrooms-button")!
    .addEventListener("click", () => {
      const timeSlot: TimeSlot = (
        documentRef.getElementById(
          "available-classroom-timeslot",
        ) as HTMLSelectElement
      ).value as TimeSlot;
      const dayOfWeek: DayOfWeek = (
        documentRef.getElementById(
          "available-classroom-day",
        ) as HTMLSelectElement
      ).value as DayOfWeek;
      const availableClassrooms: string[] = uniSchedule.findAvailableClassrooms(
        timeSlot,
        dayOfWeek,
      );
      documentRef.getElementById("available-classroom-result")!.textContent =
        `Вільні аудиторії: ${availableClassrooms.join(", ") || "Немає доступних аудиторій"}`;
    });

  // Розклад професора
  documentRef
    .getElementById("get-professor-schedule-button")!
    .addEventListener("click", () => {
      const professorId: number = +(
        documentRef.getElementById("professor-id-schedule") as HTMLInputElement
      ).value;
      const professorSchedule: Lesson[] =
        uniSchedule.getProfessorSchedule(professorId);

      const scheduleOutput = documentRef.getElementById(
        "professor-schedule-result",
      )!;
      scheduleOutput.innerHTML = ""; // Очищення попереднього результату
      if (professorSchedule.length === 0) {
        scheduleOutput.textContent =
          "Немає занять у розкладі для цього професора.";
      } else {
        professorSchedule.forEach((lesson) => {
          const lessonInfo = documentRef.createElement("div");
          lessonInfo.textContent = `Курс ID: ${lesson.courseId}, Аудиторія: ${lesson.classroomNumber}, Дата: ${lesson.dayOfWeek}, Час: ${lesson.timeSlot}`;
          scheduleOutput.appendChild(lessonInfo);
        });
      }
    });

  // Ініціалізація оновлення таблиць при завантаженні сторінки
  updateTables();
  updateProfessorAndClassroomSelection();
  updateCourseSelection();
}
