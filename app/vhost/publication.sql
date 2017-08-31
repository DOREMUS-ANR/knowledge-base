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
