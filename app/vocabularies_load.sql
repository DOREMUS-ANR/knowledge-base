DELETE FROM DB.DBA.load_list;

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/carrier';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/carrier';
ld_dir ('/data/knowledge-base/vocabularies', 'carrier.ttl','http://data.doremus.org/vocabulary/carrier');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/color_content';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/color_content';
ld_dir ('/data/knowledge-base/vocabularies', 'color_content.ttl','http://data.doremus.org/vocabulary/color_content');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/derivation';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/derivation';
ld_dir ('/data/knowledge-base/vocabularies', 'derivation.ttl','http://data.doremus.org/vocabulary/derivation');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/function';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/function';
ld_dir ('/data/knowledge-base/vocabularies', 'function.ttl','http://data.doremus.org/vocabulary/function');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/id';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/id';
ld_dir ('/data/knowledge-base/vocabularies', 'id.ttl','http://data.doremus.org/vocabulary/id');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/key';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/key';
ld_dir ('/data/knowledge-base/vocabularies', 'key.ttl','http://data.doremus.org/vocabulary/key');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/level';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/level';
ld_dir ('/data/knowledge-base/vocabularies', 'level.ttl','http://data.doremus.org/vocabulary/level');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/mode';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/mode';
ld_dir ('/data/knowledge-base/vocabularies', 'mode.ttl','http://data.doremus.org/vocabulary/mode');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/noise_reduction';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/noise_reduction';
ld_dir ('/data/knowledge-base/vocabularies', 'noise_reduction.ttl','http://data.doremus.org/vocabulary/noise_reduction');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/performance_condition';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/performance_condition';
ld_dir ('/data/knowledge-base/vocabularies', 'performance_condition.ttl','http://data.doremus.org/vocabulary/performance_condition');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/performer_status';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/performer_status';
ld_dir ('/data/knowledge-base/vocabularies', 'performer_status.ttl','http://data.doremus.org/vocabulary/performer_status');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/playing_speed';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/playing_speed';
ld_dir ('/data/knowledge-base/vocabularies', 'playing_speed.ttl','http://data.doremus.org/vocabulary/playing_speed');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/recording_equipment';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/recording_equipment';
ld_dir ('/data/knowledge-base/vocabularies', 'recording_equipment.ttl','http://data.doremus.org/vocabulary/recording_equipment');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/responsibility';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/responsibility';
ld_dir ('/data/knowledge-base/vocabularies', 'responsibility.ttl','http://data.doremus.org/vocabulary/responsibility');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/spazialization';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/spazialization';
ld_dir ('/data/knowledge-base/vocabularies', 'spazialization.ttl','http://data.doremus.org/vocabulary/spazialization');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/technique';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/technique';
ld_dir ('/data/knowledge-base/vocabularies', 'technique.ttl','http://data.doremus.org/vocabulary/technique');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/work_type';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/work_type';
ld_dir ('/data/knowledge-base/vocabularies', 'work_type.ttl','http://data.doremus.org/vocabulary/work_type');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/diabolo/genre';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/diabolo/genre';
ld_dir ('/data/knowledge-base/vocabularies', 'genre-diabolo.ttl','http://data.doremus.org/vocabulary/diabolo/genre');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/iaml/genre';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/iaml/genre';
ld_dir ('/data/knowledge-base/vocabularies', 'genre-iaml.ttl','http://data.doremus.org/vocabulary/iaml/genre');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/redomi/genre';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/redomi/genre';
ld_dir ('/data/knowledge-base/vocabularies', 'genre-redomi.ttl','http://data.doremus.org/vocabulary/redomi/genre');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/itema3/genre';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/itema3/genre';
ld_dir ('/data/knowledge-base/vocabularies', 'genre-itema3.ttl','http://data.doremus.org/vocabulary/itema3/genre');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/itema3/genre/musdoc';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/itema3/genre/musdoc';
ld_dir ('/data/knowledge-base/vocabularies', 'genre-itema3-musdoc.ttl','http://data.doremus.org/vocabulary/itema3/genre/musdoc');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/diabolo/mop';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/diabolo/mop';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-diabolo.ttl','http://data.doremus.org/vocabulary/diabolo/mop');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/iaml/mop';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/iaml/mop';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-iaml.ttl','http://data.doremus.org/vocabulary/iaml/mop');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/itema3/mop';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/itema3/mop';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-itema3.ttl','http://data.doremus.org/vocabulary/itema3/mop');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/redomi/mop';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/redomi/mop';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-redomi.ttl','http://data.doremus.org/vocabulary/redomi/mop');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://www.mimo-db.eu/InstrumentsKeywords';
SPARQL CLEAR  GRAPH 'http://www.mimo-db.eu/InstrumentsKeywords';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-mimo.ttl','http://www.mimo-db.eu/InstrumentsKeywords');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://data.bnf.fr/vocabulary/scheme/r166';
SPARQL CLEAR  GRAPH 'http://data.bnf.fr/vocabulary/scheme/r166';
ld_dir ('/data/knowledge-base/vocabularies', 'mop-rameau.ttl','http://data.bnf.fr/vocabulary/scheme/r166');
ld_dir ('/data/knowledge-base/vocabularies', 'genre-rameau.ttl','http://data.bnf.fr/vocabulary/scheme/r166');
ld_dir ('/data/knowledge-base/vocabularies', 'groups-rameau.ttl','http://data.bnf.fr/vocabulary/scheme/r166');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://iflastandards.info/ns/unimarc/terms/tos';
SPARQL CLEAR  GRAPH 'http://iflastandards.info/ns/unimarc/terms/tos';
ld_dir ('/data/knowledge-base/vocabularies', 'iaml-tos.ttl','http://iflastandards.info/ns/unimarc/terms/tos');
rdf_loader_run ();
cl_exec('checkpoint');

SPARQL CREATE GRAPH 'http://rdaregistry.info/termList/RDAContentType';
SPARQL CLEAR  GRAPH 'http://rdaregistry.info/termList/RDAContentType';
ld_dir ('/data/knowledge-base/vocabularies', 'RDAContentType.ttl','http://rdaregistry.info/termList/RDAContentType');
rdf_loader_run ();
cl_exec('checkpoint');


SPARQL CREATE GRAPH 'http://data.doremus.org/vocabulary/catalog';
SPARQL CLEAR  GRAPH 'http://data.doremus.org/vocabulary/catalog';
ld_dir ('/data/knowledge-base/vocabularies', 'catalog.ttl','http://data.doremus.org/vocabulary/catalog');
rdf_loader_run ();
cl_exec('checkpoint');
