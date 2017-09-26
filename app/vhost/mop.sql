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
