create table cookbooks (
    id text collate nocase not null,
    version int not null,
    title text not null,
    author text,
    primary key (id)
)  strict;

create table cookbookRecipes (
    cookbookId text collate nocase not null,
    recipeId text collate nocase not null,
    sequence int not null,
    primary key (cookbookId, recipeId),
    foreign key (cookbookId) references cookbookId(id)
        on update cascade
        on delete cascade,
    foreign key (recipeId) references recipes(id)
        on update cascade
        on delete restrict,
    unique (cookbookId, sequence)
)  strict;

create table cookbookSections (
    id text collate nocase not null,
    cookbookId text collate nocase not null,
    version int not null,
    sequenceBefore int not null,
    sectionName text not null,
    primary key (id),
    foreign key (cookbookId) references cookbookId(id)
        on update cascade
        on delete cascade,
    unique (cookbookId, sequenceBefore)
)  strict;

create table subRecipes (
    id text collate nocase not null,
    version int not null,
    recipeId text collate nocase not null,
    sequence int not null,
    title text,
    primary key (id),
    foreign key (recipeId) references recipes(id)
        on update cascade
        on delete cascade,
    unique (recipeId, sequence)
)  strict;
