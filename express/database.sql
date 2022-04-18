create database library;

create table usuarios(
    id serial primary key not null,
    nombre Varchar(64) not null,
    email Varchar(128) not null,
    password Varchar(64) not null,
    UNIQUE (email));
);

