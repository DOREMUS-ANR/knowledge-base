This repository contains the input and output files of the Pivot Graph Constructor tool (https://github.com/DOREMUS-ANR/pivot-graph-constructor).

- finalResults.rdf: the concatenation of the 3 alignment files produced by the linking phase (see root of the repository linked-data)

- surelinks.rdf  : file containing all sure links found
- tovalidate.rdf : file containing all links that have to be manually validated
- pivotgraph.rdf : the actual pivot graph, linking created uris to their equivalent in different bases using sameAs properties
- VSC.rdf        : "very special cases", containing abnormal (conflictuous, erroneous, etc) patterns with a very high or perfect conf value. 
