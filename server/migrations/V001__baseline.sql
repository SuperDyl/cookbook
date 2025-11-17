create table recipes (
    id text collate nocase not null,
    version int not null,
    title text not null,
    subtitle text,
    author text,
    ingredients text,
    instructions text,
    primary key (id)
)  strict;


