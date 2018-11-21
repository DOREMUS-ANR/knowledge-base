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
opts=>vector ('browse_sheet', '', 'cors', '*', 'cors_restricted', 0, 'url_rewrite', 'http_rule_list_17'),
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
