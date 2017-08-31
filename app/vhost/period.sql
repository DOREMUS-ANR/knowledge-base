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
