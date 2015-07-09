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
    detail_name varchar(10),
    gender char(1),
    identified_number char(18),
    company_name1 varchar(50),
    company_name2 varchar(50),
    company_name3 varchar(50),
    created_time timestamp,
    praise int,
    primary key(id),
    foreign key(id) references usr(id)
)CHARACTER SET utf8;

create table cargoo_name(
    id int auto_increment,
    name varchar(15),
    parent_id int,
    activate smallint,
    primary key(id),
    foreign key(parent_id) references cargoo_name(id)
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
    order_id varchar(20),
    license varchar(15),
    consignor int,
    consignee int,
    consignee_name varchar(6),
    company_name varchar(50),
    category int,
    cargoo_name int,
    origin varchar(20),
    destination varchar(20),
    quantity double,
    current_state varchar(10),
    created_time timestamp,
    etd timestamp,
    type char(4),
    mobile char(11),
    primary key(id),
    foreign key(consignor) references usr(id),
    foreign key(consignee) references usr(id),
    foreign key(category) references cargoo_name(id),
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
    DESCRIPTION varchar(200),
    order_id int,
    level smallint,
    primary key(id),
    foreign key(consignor) references usr(id),
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
    usr_id int,
    foreign key(usr_id) references usr(id),
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
insert into usr(id,name,password,authority,activate) values(1,'tom','202cb962ac59075b964b07152d234b70','ROLE_CONSIGNEE',1);
insert into usr(id,name,password,authority,activate) values(2,'peter','202cb962ac59075b964b07152d234b70','ROLE_CONSIGNOR',1);
insert into usr(id,name,password,authority,activate) values(3,'admin','202cb962ac59075b964b07152d234b70','ROLE_ADMIN',1);

/*test user detail*/    
insert into usr_detail(id,detail_name,gender,company_name1,company_name2,company_name3) values(1,'tomeii','f','company1','company2','company3');
insert into usr_detail(id,detail_name,gender,company_name1,company_name2,company_name3) values(2,'peter lei','m','company1','company2','company3');

/*test category*/
insert into cargoo_name(id,name,activate) values(1,'firstcategory1',1);
insert into cargoo_name(id,name,parent_id,activate) values(2,'secondCategory1',1,1);
insert into cargoo_name(id,name,parent_id,activate) values(3,'secondCategory2',1,1);
insert into cargoo_name(id,name,activate) values(4,'firstcategory2',1);
insert into cargoo_name(id,name,parent_id,activate) values(5,'secondCategory3',4,1);
insert into cargoo_name(id,name,parent_id,activate) values(6,'secondCategory4',4,1);

/*test orders*/
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state,order_id,category) values(1,'沪A-123456',2,1,'tom','haha',2,'待分配','aabbcc','1');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state,order_id,category) values(2,'沪A-123456',2,1,'tom','haha',2,'待确认','aabbcc','1');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state,order_id,category) values(3,'沪A-123456',2,1,'tom','haha',5,'运送中','aabbcc','4');
insert into orders(id,license,consignor,consignee,consignee_name,company_name,cargoo_name,current_state,order_id,category) values(4,'沪A-123456',2,1,'tom','haha',5,'已送达','aabbcc','4');

/*test orders state*/    
insert into order_state(order_id,state_name,created_time) values(1,'待分配','2013-1-1 12:13:14');
insert into order_state(order_id,state_name,created_time) values(1,'待确认','2013-1-1 12:13:14');
insert into order_state(order_id,state_name,created_time) values(1,'运送中','2013-1-1 12:13:14');
insert into order_state(order_id,state_name,created_time) values(1,'已送达','2013-1-1 12:13:14');

CREATE INDEX order_id_index ON orders(order_id);