drop database zh;

create database zh;

use zh;

create table usr(
    id int auto_increment,
    name char(11),
    password char(64),
    authority varchar(20),
    activate smallint,
    primary key(id)
)CHARACTER SET utf8;

create table usr_detail(
    id int,
    name varchar(10),
    gender char(1),
    identified_number char(18),
    company_name varchar(20),
    primary key(id),
    foreign key(id) references usr(id)
)CHARACTER SET utf8;

create table cargoo_category(
    id int auto_increment,
    name varchar(15),
    parent_id int,
    activate smallint,
    primary key(id),
    foreign key(parent_id) references cargoo_category(id)
)CHARACTER SET utf8;

create table cargoo_name(
    id int auto_increment,
    category_id int,
    name varchar(20),
    primary key(id),
    foreign key(category_id) references cargoo_category(id)
)CHARACTER SET utf8;

create table common_consignee(
    id int auto_increment,
    consignee_id int,
    consignor_id int,
    foreign key(consignee_id) references usr(id),
    foreign key(consignor_id) references usr(id),
    primary key(id)
)CHARACTER SET utf8;

create table orders(
    id int auto_increment,
    license varchar(15),
    consignor int,
    consignee int,
    consignee_name varchar(6),
    company_name varchar(50),
    first_category int,
    second_category int,
    cargoo_name int,
    origin varchar(20),
    destination varchar(20),
    quantity double,
    current_state varchar(10),
    created_time timestamp,
    type char(1),
    primary key(id),
    foreign key(consignor) references usr(id),
    foreign key(consignee) references usr(id),
    foreign key(first_category) references cargoo_category(id),
    foreign key(second_category) references cargoo_category(id),
    foreign key(cargoo_name) references cargoo_name(id)
)CHARACTER SET utf8;

create table order_gis(
    id bigint auto_increment,
    order_id int,
    LONGITUDE decimal,
    latitude decimal,
    primary key(id),
    foreign key(order_id) references orders(id)
)CHARACTER SET utf8;

create table refuse_reason(
    id int auto_increment,
    name varchar(20),
    primary key(id)
)CHARACTER SET utf8;

create table order_state(
    id int auto_increment,
    order_id int,
    state_name varchar(10),
    img_url varchar(50),
    refuse_reason int ,
    refuse_desc varchar(200),
    created_time timestamp,
    primary key(id),
    foreign key(order_id) references orders(id),
    foreign key(refuse_reason) references refuse_reason(id)
)CHARACTER SET utf8;

create table reviews(
    id int auto_increment,
    consignor int,
    consignee int,
    DESCRIPTION varchar(200),
    order_id int,
    primary key(id),
    foreign key(consignor) references usr(id),
    foreign key(consignee) references usr(id),
    foreign key(order_id) references orders(id)
)CHARACTER SET utf8;

create table suggestion(
    id int auto_increment,
    description varchar(200),
    created_time timestamp,
    primary key(id)
)CHARACTER SET utf8;

create table vehicle(
    id int auto_increment,
    license varchar(15),
    vehicle_type varchar(10),
    vehicle_length varchar(10),
    vehicle_weight varchar(10),
    primary key(id)
)CHARACTER SET utf8;

create table scroll_image(
    id int auto_increment,
    image_url varchar(50),
    image_href varchar(20),
    primary key(id)
);

create table advertise(
    id int auto_increment,
    title varchar(20),
    content varchar(4000),
    primary key(id)
);

/*test usr*/
insert into usr(id,name,password,authority,activate) values(1,'tom','123','ROLE_CONSIGNEE',1);
insert into usr(id,name,password,authority,activate) values(2,'peter','123','ROLE_CONSIGNOR',1);

/*test user detail*/    
insert into usr_detail(id,name,gender) values(1,'tomeii','f');

/*test category*/
insert into cargoo_category(id,name,activate) values(1,'firstcategory1',1);
insert into cargoo_category(id,name,parent_id,activate) values(2,'secondCategory1',1,1);
insert into cargoo_category(id,name,parent_id,activate) values(3,'secondCategory2',1,1);
insert into cargoo_category(id,name,activate) values(4,'firstcategory2',1);
insert into cargoo_category(id,name,parent_id,activate) values(5,'secondCategory3',4,1);
insert into cargoo_category(id,name,parent_id,activate) values(6,'secondCategory4',4,1);

/*test cargoo-name*/
insert into cargoo_name(id,name,category_id) values(1,'second2-name',2);
insert into cargoo_name(id,name,category_id) values(2,'second3-name',3);
insert into cargoo_name(id,name,category_id) values(3,'second5-name',5);
insert into cargoo_name(id,name,category_id) values(4,'second6-name',6);

/*test orders*/
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state) values(1,'沪A-123456',2,1,'tom','haha',1,'待分配');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state) values(2,'沪A-123456',2,1,'tom','haha',2,'待确认');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state) values(3,'沪A-123456',2,1,'tom','haha',3,'运送中');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state) values(4,'沪A-123456',2,1,'tom','haha',4,'已送达');