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
opts=>vector ('browse_sheet', '', 'cors', '*', 'cors_restricted', 0, 'url_rewrite', 'http_rule_list_21'),
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
