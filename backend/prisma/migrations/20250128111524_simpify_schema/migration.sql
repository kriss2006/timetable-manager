/*
  Warnings:

  - You are about to drop the `studentclass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjectteacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timetableelement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentclass` DROP FOREIGN KEY `StudentClass_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `subject` DROP FOREIGN KEY `Subject_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjectteacher` DROP FOREIGN KEY `SubjectTeacher_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjectteacher` DROP FOREIGN KEY `SubjectTeacher_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjectteacher` DROP FOREIGN KEY `SubjectTeacher_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_even_week_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_even_week_subject_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_group_2_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_group_2_subject_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_student_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_subject_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetableelement` DROP FOREIGN KEY `TimetableElement_year_id_fkey`;

-- DropTable
DROP TABLE `studentclass`;

-- DropTable
DROP TABLE `subjectteacher`;

-- DropTable
DROP TABLE `timetableelement`;

-- CreateTable
CREATE TABLE `student_class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(5) NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_class_subject_teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classesPerWeek` TINYINT NOT NULL,
    `student_class_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timetable_element` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` TINYINT NOT NULL,
    `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    `period` TINYINT NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `year_id` INTEGER NOT NULL,
    `student_class_id` INTEGER NOT NULL,
    `subject_teacher_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `room_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class` ADD CONSTRAINT `student_class_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `subject_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class_subject_teacher` ADD CONSTRAINT `student_class_subject_teacher_student_class_id_fkey` FOREIGN KEY (`student_class_id`) REFERENCES `student_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class_subject_teacher` ADD CONSTRAINT `student_class_subject_teacher_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class_subject_teacher` ADD CONSTRAINT `student_class_subject_teacher_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class_subject_teacher` ADD CONSTRAINT `student_class_subject_teacher_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetable_element` ADD CONSTRAINT `timetable_element_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetable_element` ADD CONSTRAINT `timetable_element_student_class_id_fkey` FOREIGN KEY (`student_class_id`) REFERENCES `student_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetable_element` ADD CONSTRAINT `timetable_element_subject_teacher_id_fkey` FOREIGN KEY (`subject_teacher_id`) REFERENCES `student_class_subject_teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetable_element` ADD CONSTRAINT `timetable_element_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;

-- RenameIndex
ALTER TABLE `year` RENAME INDEX `Year_name_key` TO `year_name_key`;
