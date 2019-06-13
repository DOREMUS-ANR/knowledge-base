public class ExtractEntities {

	private static final String WHERE = null;

	public static void query_model(String arg) throws IOException, ParseException {
		
		Model model = FileManager.get().loadModel(arg);
		String queryString = 
				
			/////////////////////////Adding prefixes/////////////////////////
"prefix schema: <http://schema.org/>"+
"prefix cro:   <http://rhizomik.net/ontologies/copyrightonto#>"+
"prefix owl:   <http://www.w3.org/2002/07/owl#>"+
"prefix ecrm:  <http://erlangen-crm.org/current/> "+
"prefix xsd:   <http://www.w3.org/2001/XMLSchema#> "+
"prefix dcterms: <http://purl.org/dc/terms/> "+
"prefix efrbroo: <http://erlangen-crm.org/efrbroo/> "+
"prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> "+
"prefix mus:   <http://data.doremus.org/ontology#> "+
"prefix time:  <http://www.w3.org/2006/time#> "+
"prefix prov:  <http://www.w3.org/ns/prov#> "+
"prefix foaf:  <http://xmlns.com/foaf/0.1/> "+
"prefix dc:    <http://purl.org/dc/elements/1.1/> "+
			/////////////////////////SPARQL Request for F31 class/////////////////////////
			
	"SELECT  ?uri ?title ?date"+
		"WHERE{"+ 
			"?eventPrevu a efrbroo:F29_Recording_Event;"+
			"ecrm:P4_has_time-span  ?date_uri."+
			"?date_uri rdfs:label ?date."+
			"?event a efrbroo:F31_Performance;" + 
			"ecrm:P102_has_title ?title."+
		"}";
			/////////////////////////SPARQL Request for M26 class/////////////////////////
//	"SELECT ?uri ?title ?date"+
//		 "WHERE{"+ 
//			"?eventPrevu a mus:M26_Foreseen_Performance;"+
//		        "mus:U8_foresees_time_span ?date_uri."+
//			"?date_uri rdfs:label ?date."+
//			"?eventPrevu a mus:M26_Foreseen_Performance;"+
//		        "ecrm:P102_has_title ?title."+
//	        "}";
			
		Query query = QueryFactory.create(queryString);
		QueryExecution qexec = QueryExecutionFactory.create(query, model);
		try {
			ResultSet results = qexec.execSelect();
			
			while (results.hasNext()) {
				QuerySolution soln = results.nextSolution();
					Literal uri = soln.getLiteral("uri");
				        Literal title = soln.getLiteral("title");
					Literal date = soln.getLiteral("date");
				
			System.out.println(uri+","+title+","+date);
			}		
		}finally {		
		}	
	}	
	}
