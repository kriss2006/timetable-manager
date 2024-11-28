-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(32) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `type` ENUM('student', 'teacher', 'admin', 'super_admin') NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Year` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(9) NOT NULL,

    UNIQUE INDEX `Year_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentClass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(5) NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `abbreviation` VARCHAR(32) NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `initials` VARCHAR(4) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectTeacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimetableElement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` TINYINT NOT NULL,
    `period` TINYINT NOT NULL,
    `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `alternating` BOOLEAN NOT NULL,
    `split` BOOLEAN NOT NULL,
    `year_id` INTEGER NOT NULL,
    `student_class_id` INTEGER NOT NULL,
    `subject_teacher_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `even_week_subject_teacher_id` INTEGER NULL,
    `even_week_room_id` INTEGER NULL,
    `group_2_subject_teacher_id` INTEGER NULL,
    `group_2_room_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `Year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentClass` ADD CONSTRAINT `StudentClass_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `Year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `Year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectTeacher` ADD CONSTRAINT `SubjectTeacher_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectTeacher` ADD CONSTRAINT `SubjectTeacher_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectTeacher` ADD CONSTRAINT `SubjectTeacher_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `Year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_year_id_fkey` FOREIGN KEY (`year_id`) REFERENCES `Year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_student_class_id_fkey` FOREIGN KEY (`student_class_id`) REFERENCES `StudentClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_subject_teacher_id_fkey` FOREIGN KEY (`subject_teacher_id`) REFERENCES `SubjectTeacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_even_week_subject_teacher_id_fkey` FOREIGN KEY (`even_week_subject_teacher_id`) REFERENCES `SubjectTeacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_even_week_room_id_fkey` FOREIGN KEY (`even_week_room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_group_2_subject_teacher_id_fkey` FOREIGN KEY (`group_2_subject_teacher_id`) REFERENCES `SubjectTeacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableElement` ADD CONSTRAINT `TimetableElement_group_2_room_id_fkey` FOREIGN KEY (`group_2_room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
