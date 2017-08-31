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
