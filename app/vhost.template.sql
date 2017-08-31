DB.DBA.VHOST_REMOVE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/%%name%%'
);

DB.DBA.VHOST_DEFINE (
lhost=>'*ini*',
vhost=>'*ini*',
lpath=>'/%%name%%',
ppath=>'/DAV/',
is_dav=>1,
is_brws=>0,
def_page=>'',
vsp_user=>'dba',
ses_vars=>0,
opts=>vector ('browse_sheet', '', 'url_rewrite', 'http_rule_list_%%id%%'),
is_default_host=>0);

DB.DBA.URLREWRITE_CREATE_RULELIST (
'http_rule_list_%%id%%',
1,
vector ('http_rule_%%id%%'));

DB.DBA.URLREWRITE_CREATE_REGEX_RULE (
'http_rule_%%id%%',
1,
'/%%name%%/(.*)',
vector ('par_%%id%%'),
1,
'/fct/rdfdesc/description.vsp?g=%%host%%/%%name%%/%U',
vector ('par_%%id%%'),
NULL,
NULL,
2,
0,
'');
