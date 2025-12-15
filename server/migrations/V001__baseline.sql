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
    subRecipeId text collate nocase not null,
    sequence int not null,
    raw text not null,
    primary key (id),
    foreign key (subRecipeId) references subRecipes(id)
        on update cascade
        on delete cascade,
    unique (subRecipeId, sequence)
)  strict;

create table instructions (
    id text collate nocase not null,
    version int not null,
    subRecipeId text collate nocase not null,
    sequence int not null,
    raw text not null,
    primary key (id),
    foreign key (subRecipeId) references subRecipes(id)
        on update cascade
        on delete cascade,
    unique (subRecipeId, sequence)
)  strict;

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
    foreign key (cookbookId) references cookbooks(id)
        on update cascade
        on delete cascade,
    foreign key (recipeId) references recipes(id)
        on update cascade
        on delete cascade,
    unique (cookbookId, sequence)
)  strict;

create table cookbookSections (
    id text collate nocase not null,
    cookbookId text collate nocase not null,
    version int not null,
    sequenceBefore int not null,
    sectionName text not null,
    primary key (id),
    foreign key (cookbookId) references cookbooks(id)
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
