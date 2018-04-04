DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/vocabulary'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/vocabulary',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_1'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_1',
1,
vector ('http_rule_1'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_1',
1,
'/vocabulary/(.*)',
vector ('par_1'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/vocabulary/%U',
vector ('par_1'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/expression'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/expression',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_2'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_2',
1,
vector ('http_rule_2'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_2',
1,
'/expression/(.*)',
vector ('par_2'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/expression/%U',
vector ('par_2'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/event'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/event',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_3'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_3',
1,
vector ('http_rule_3'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_3',
1,
'/event/(.*)',
vector ('par_3'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/event/%U',
vector ('par_3'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/work'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/work',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_4'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_4',
1,
vector ('http_rule_4'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_4',
1,
'/work/(.*)',
vector ('par_4'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/work/%U',
vector ('par_4'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/publication'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/publication',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_5'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_5',
1,
vector ('http_rule_5'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_5',
1,
'/publication/(.*)',
vector ('par_5'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/publication/%U',
vector ('par_5'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/performance'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/performance',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_6'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_6',
1,
vector ('http_rule_6'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_6',
1,
'/performance/(.*)',
vector ('par_6'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/performance/%U',
vector ('par_6'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/artist'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/artist',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_7'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_7',
1,
vector ('http_rule_7'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_7',
1,
'/artist/(.*)',
vector ('par_7'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/artist/%U',
vector ('par_7'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/organization'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/organization',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_8'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_8',
1,
vector ('http_rule_8'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_8',
1,
'/organization/(.*)',
vector ('par_8'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/organization/%U',
vector ('par_8'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/period'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/period',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_9'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_9',
1,
vector ('http_rule_9'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_9',
1,
'/period/(.*)',
vector ('par_9'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/period/%U',
vector ('par_9'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/editing'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/editing',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_10'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_10',
1,
vector ('http_rule_10'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_10',
1,
'/editing/(.*)',
vector ('par_10'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/editing/%U',
vector ('par_10'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/manifestation'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/manifestation',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_11'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_11',
1,
vector ('http_rule_11'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_11',
1,
'/manifestation/(.*)',
vector ('par_11'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/manifestation/%U',
vector ('par_11'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/rate'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/rate',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_12'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_12',
1,
vector ('http_rule_12'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_12',
1,
'/rate/(.*)',
vector ('par_12'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/rate/%U',
vector ('par_12'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/support'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/support',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_13'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_13',
1,
vector ('http_rule_13'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_13',
1,
'/support/(.*)',
vector ('par_13'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/support/%U',
vector ('par_13'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/track'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/track',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_14'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_14',
1,
vector ('http_rule_14'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_14',
1,
'/track/(.*)',
vector ('par_14'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/track/%U',
vector ('par_14'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/function'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/function',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_15'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_15',
1,
vector ('http_rule_15'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_15',
1,
'/function/(.*)',
vector ('par_15'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/function/%U',
vector ('par_15'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/recording'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/recording',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_16'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_16',
1,
vector ('http_rule_16'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_16',
1,
'/recording/(.*)',
vector ('par_16'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/recording/%U',
vector ('par_16'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/place'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/place',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_17'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_17',
1,
vector ('http_rule_17'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_17',
1,
'/place/(.*)',
vector ('par_17'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/place/%U',
vector ('par_17'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/mop'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/mop',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_18'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_18',
1,
vector ('http_rule_18'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_18',
1,
'/mop/(.*)',
vector ('par_18'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/mop/%U',
vector ('par_18'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/bnf'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/bnf',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_19'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_19',
1,
vector ('http_rule_19'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_19',
1,
'/bnf(/.*)',
vector ('par_19'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/bnf%U',
vector ('par_19'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/philharmonie'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/philharmonie',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_20'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_20',
1,
vector ('http_rule_20'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_20',
1,
'/philharmonie/(.*)',
vector ('par_20'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/philharmonie/%U',
vector ('par_20'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/itema3'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/itema3',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_21'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_21',
1,
vector ('http_rule_21'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_21',
1,
'/itema3/(.*)',
vector ('par_21'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/itema3/%U',
vector ('par_21'),
NULL,
NULL,
2,
0,
'');
DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/euterpe'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/euterpe',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_22'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_22',
1,
vector ('http_rule_22'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_22',
1,
'/euterpe/(.*)',
vector ('par_22'),
1,
'/fct/rdfdesc/description.vsp?g=http://data.doremus.org/euterpe/%U',
vector ('par_22'),
NULL,
NULL,
2,
0,
'');
