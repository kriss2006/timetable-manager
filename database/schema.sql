CREATE DATABASE timetable_manager;
USE timetable_manager;

CREATE TABLE teacher (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(4)
);

CREATE TABLE subject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
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
    year_id INT,
    FOREIGN KEY (year_id) REFERENCES year(id)
);

CREATE TABLE room (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    -- type ENUM('', 'lecture_hall', 'classroom') NOT NULL,
    year_id INT,
    FOREIGN KEY (year_id) REFERENCES year(id)
);

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'teacher', 'admin', 'super_admin') NOT NULL
);

CREATE TABLE teacher_subject (
    teacher_id INT,
    subject_id INT,
    year_id INT,
    PRIMARY KEY (teacher_id, subject_id, year_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    FOREIGN KEY (year_id) REFERENCES year(id)
);
