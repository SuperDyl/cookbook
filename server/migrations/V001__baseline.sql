create table recipes (
    id text collate nocase not null,
    version int not null,
    title text not null,
    author text,
    url text,
    primary key (id)
)  strict;

create table ingredients (
    id text collate nocase not null,
    version int not null,
    recipeId text collate nocase not null,
    sequence int not null,
    raw text not null,
    primary key (id),
    foreign key (recipeId) references recipes(id)
        on update cascade
        on delete cascade,
    unique (recipeId, sequence)
)  strict;

create table instructions (
    id text collate nocase not null,
    version int not null,
    recipeId text collate nocase not null,
    sequence int not null,
    raw text not null,
    primary key (id),
    foreign key (recipeId) references recipes(id)
        on update cascade
        on delete cascade,
    unique (recipeId, sequence)
)  strict;
