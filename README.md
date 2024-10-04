# UniversityScheduleTS

Repository for TypeScript course.

You can check functionality on [github pages](https://goodwin251.github.io/UniversityScheduleTS/).

## Created by Solodkyi Yaroslav, student PD-42

___

There is simple University schedule program that can be launced on NodeJS and in browser, where you can add and delete lections, professors, classrooms and courses.

**Branches**:

- *main*

## Code description

### UniSchedule

```typescript
//Verify is lesson valid with use of custom conflict types
validateLesson(lesson: Lesson): ScheduleConflict | null
```

```typescript
//Add Proffesor
addProfessor(professor: Professor): void
```

```typescript
//Add Lesson
addLesson(lesson: Lesson): boolean
```

```typescript
//Change classroom for course
reassignClassroom(lessonId: number, newClassroomNumber: string): boolean
```

```typescript
//Cancel Lesson
cancelLesson(lessonId: number): void
```

```typescript
// Find all availbe classrooms
findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[]
```

```typescript
//Get proffesor schedule
getProfessorSchedule(professorId: number): Lesson[]
```

```typescript
//Check how much classroom used in %
getClassroomUtilization(classroomNumber: string): number
```

```typescript
//Get most popular course type
getMostPopularCourseType(): CourseType
```
