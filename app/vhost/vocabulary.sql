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
