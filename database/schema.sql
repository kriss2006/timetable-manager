CREATE DATABASE timetable_manager;
USE timetable_manager;

CREATE TABLE teacher (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(4) NOT NULL
);

CREATE TABLE subject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(255),
    type VARCHAR(255) NOT NULL
    -- type ENUM('ООП', 'ОтПП', 'СПП', 'РП/УП-А', '...', 'ОбПП', 'РПП') NOT NULL
);

CREATE TABLE year (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(9) NOT NULL
);

CREATE TABLE class (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(5) NOT NULL,
    year_id INT NOT NULL,
    FOREIGN KEY (year_id) REFERENCES year(id)
);

CREATE TABLE room (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    -- type ENUM('', 'lecture_hall', 'classroom') NOT NULL,
    year_id INT NOT NULL,
    FOREIGN KEY (year_id) REFERENCES year(id)
);

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'teacher', 'admin', 'super_admin') NOT NULL
);

CREATE TABLE subject_teacher (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    year_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id),
    FOREIGN KEY (year_id) REFERENCES year(id)
);

CREATE TABLE timetable_element (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year_id INT NOT NULL,
    term ENUM('1', '2') NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    period TINYINT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    class_id INT NOT NULL,
    subject_teacher_id INT NOT NULL,
    room_id INT NOT NULL,
    alternating BOOLEAN NOT NULL,
    even_week_subject_teacher_id INT,
    even_week_room_id INT,
    split BOOLEAN NOT NULL,
    group_2_subject_teacher_id INT,
    group_2_room_id INT,
    FOREIGN KEY (year_id) REFERENCES year(id),
    FOREIGN KEY (class_id) REFERENCES class(id),
    FOREIGN KEY (subject_teacher_id) REFERENCES subject_teacher(id),
    FOREIGN KEY (room_id) REFERENCES room(id),
    FOREIGN KEY (even_week_subject_teacher_id) REFERENCES subject_teacher(id),
    FOREIGN KEY (even_week_room_id) REFERENCES room(id),
    FOREIGN KEY (group_2_subject_teacher_id) REFERENCES subject_teacher(id),
    FOREIGN KEY (group_2_room_id) REFERENCES room(id)
);

insert into subject (name, abbreviation, type, year_id) values ('Български език и литература', 'БЕЛ', 'ООП', 1), ('Матем
атика', NULL, 'ООП', 1), ('География и икономика', 'ГИ', 'ООП', 1);

INSERT INTO subject_teacher (subject_id, teacher_id, year_id) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2);

INSERT INTO room (name, type, year_id) VALUES
('1', 'lecture_hall', 1),
('2', 'classroom', 1),
('3', 'classroom', 1);

INSERT INTO timetable_element (year_id, term, day, period, start_time, end_time, class_id, subject_teacher_id, room_id, alternating, even_week_subject_teacher_id, even_week_room_id, split, group_2_subject_teacher_id, group_2_room_id) VALUES
(1, '1', 'Monday', 1, '08:00:00', '08:40:00', 1, 1, 14, FALSE, NULL, NULL, FALSE, NULL, NULL),
(1, '1', 'Monday', 2, '08:40:00', '09:20:00', 1, 1, 14, FALSE, NULL, NULL, FALSE, NULL, NULL),
(1, '1', 'Monday', 3, '09:30:00', '10:10:00', 1, 2, 15, FALSE, NULL, NULL, FALSE, NULL, NULL),
(1, '1', 'Monday', 4, '10:10:00', '10:50:00', 1, 2, 15, FALSE, NULL, NULL, FALSE, NULL, NULL),
(1, '1', 'Monday', 5, '11:10:00', '11:50:00', 1, 3, 16, FALSE, NULL, NULL, FALSE, NULL, NULL),
(1, '1', 'Monday', 6, '11:50:00', '12:30:00', 1, 3, 16, FALSE, NULL, NULL, FALSE, NULL, NULL);

select * from timetable_element where year_id = 1 and term = 1 order by start_time asc;