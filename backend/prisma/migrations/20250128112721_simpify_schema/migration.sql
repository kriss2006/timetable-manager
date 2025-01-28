/*
  Warnings:

  - You are about to drop the column `subject_teacher_id` on the `timetable_element` table. All the data in the column will be lost.
  - You are about to drop the `student_class_subject_teacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `curriculum_id` to the `timetable_element` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_class_subject_teacher` DROP FOREIGN KEY `student_class_subject_teacher_student_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_class_subject_teacher` DROP FOREIGN KEY `student_class_subject_teacher_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_class_subject_teacher` DROP FOREIGN KEY `student_class_subject_teacher_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_class_subject_teacher` DROP FOREIGN KEY `student_class_subject_teacher_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetable_element` DROP FOREIGN KEY `timetable_element_subject_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `timetable_element` DROP COLUMN `subject_teacher_id`,
    ADD COLUMN `curriculum_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `student_class_subject_teacher`;

-- CreateTable
CREATE TABLE `curriculum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classesPerWeek` TINYINT NOT NULL,
    `student_class_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `curriculum` ADD CONSTRAINT `curriculum_student_class_id_fkey` FOREIGN KEY (`student_class_id`) REFERENCES `student_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum` ADD CONSTRAINT `curriculum_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum` ADD CONSTRAINT `curriculum_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum` ADD CONSTRAINT `curriculum_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetable_element` ADD CONSTRAINT `timetable_element_curriculum_id_fkey` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
