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
