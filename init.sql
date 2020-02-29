CREATE TABLE metric (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table buy_metric
(
  count integer default 0 not null,
  created_at timestamp default now() not null,
  collect_metric_group bigint default 0 not null
);

alter table buy_metric owner to postgres;

create unique index buy_metric_collect_metric_group_uindex
  on buy_metric (collect_metric_group);
