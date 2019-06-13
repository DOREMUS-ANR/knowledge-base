public class Parcours{
	
public static void main(String[] args) throws IOException  {
	  
	ArrayList<Concert> scheduledEventList = new ArrayList<Concert>();
	ArrayList<Concert> doneEventList = new ArrayList<Concert>(); 

	final HashMap<String, Double> thresholdMap = new HashMap<>();	
	thresholdMap.put("High", 0.8) ; 
	thresholdMap.put("Medium", 0.5) ;
	thresholdMap.put("Low", 0.2) ;	
    DecimalFormat df = new DecimalFormat("0.000"); 


	File scheduledDir = new File("/home/hichem/Bureau/IPS_M1_S2/Projet_TER/code/input/M26/");
	File doneDir = new File("/home/hichem/Bureau/IPS_M1_S2/Projet_TER/code/input/F31/");
	String outputDirPath = "/home/hichem/Bureau/IPS_M1_S2/Projet_TER/code/output/" ;

	File[] scheduledDirectoryListing = scheduledDir.listFiles();
	File[] doneDirectoryListing = doneDir.listFiles();
											  		///////////////////////////////////////////////////
													/////////// START OF DB READING PART //////////////
													///////////////////////////////////////////////////
	  if (scheduledDirectoryListing != null) {
	    for (File child : scheduledDirectoryListing) 
	    {
	      // Do something with child
	    	//System.out.println(child);
	    	//System.out.println();
			BufferedReader scheduledEventsReader = new BufferedReader(new FileReader(child));
			String CurrentLine;
			while ((CurrentLine = scheduledEventsReader.readLine()) != null) 
			{		   
				String[] tokens = CurrentLine.split("\",");		   		 
			    scheduledEventList.add(new Concert(tokens[tokens.length-3], tokens[tokens.length-2], tokens[tokens.length-1].split("T")[0])) ;	
			}
			scheduledEventsReader.close();
	    }
	  } else {
		  System.err.println(scheduledDirectoryListing+" is NULL !!");
	  }	  	 
	  
	  if (doneDirectoryListing != null) {
		    for (File child : doneDirectoryListing) {
		      // Do something with child
		    	//System.out.println(child);
		    	BufferedReader doneEventsReader = new BufferedReader(new FileReader(child));
		    	String CurrentLine ; 
		    	while ((CurrentLine = doneEventsReader.readLine()) != null) 
		    	{
		    		String[] tokens = CurrentLine.split("\",");
		    		doneEventList.add(new Concert(tokens[tokens.length-3], tokens[tokens.length-2], tokens[tokens.length-1].split("T")[0])) ;
		    	}
		    	doneEventsReader.close();
		    }
		  } else {
			  System.err.println(doneDirectoryListing+" is NULL !!");		    
		  }
													  ///////////////////////////////////////////////////
													  /////////// END OF DB READING PART ////////////////
													  ///////////////////////////////////////////////////

										  	/////////////////////////////////////////////////////////////////////
											///////// START OF PROCESSING & OUTPUT GENERATION PART //////////////
										  	/////////////////////////////////////////////////////////////////////
	 
	  
	  for (HashMap.Entry<String, Double> entry : thresholdMap.entrySet()) 
	  {
	      System.out.println("Similarities for "+entry.getKey() + " threshold with value " + entry.getValue());
	      	      
	      BufferedWriter buffWriter = new BufferedWriter(new FileWriter(new File(outputDirPath+entry.getValue()))) ;
	  	
	  	for (int i = 0; i < scheduledEventList.size() ; i++) 
	  	{		
	  		for (int j = 0; j< doneEventList.size() ; j++) 
	  		{		
	  			// verify same date or not
	  			if (scheduledEventList.get(i).getDate().equals(doneEventList.get(j).getDate()))
	  			{
	  				// verify similarity								
	  				double simScore = SimilarityChecker.getSimilarityScore(scheduledEventList.get(i).getName(),doneEventList.get(j).getName() ) ;

	  				Double newValue=0.0;
	  				if( entry.getValue()==0.2) {
	  					newValue=entry.getValue()+0.29;
	  				}
	  				if( entry.getValue()==0.5) {
	  					newValue=entry.getValue()+0.29;
	  				}
	  				if( entry.getValue()==0.8) {
	  					newValue=entry.getValue()+0.2;
	  				}
	  				
	  				if ( (simScore >= entry.getValue())&&(simScore<=newValue) )
	  				{
	  					
	  					String state="";
	  					if ((simScore >= 0.2) && (simScore < 0.3) ){ 
	  						state = "Différents";}
	  					if ((simScore >= 0.3) && (simScore < 0.8) ){ 
	  						state = "Légérement Differents";}
	  					if ((simScore >= 0.8) && (simScore <= 1) ){ 
	  						state = "Date et titre pareils";}
	  					
	  					System.out.println(scheduledEventList.get(i).getName() +"  "+ scheduledEventList.get(i).getDate() +"  "+ scheduledEventList.get(i).getUri());
	  					System.out.println(doneEventList.get(j).getName() +"  "+ doneEventList.get(j).getDate() +"  "+ doneEventList.get(j).getUri());
	  					System.out.println(df.format(simScore));
	  					System.out.println();

	  					buffWriter.append(scheduledEventList.get(i).getName() +"\"  "+ scheduledEventList.get(i).getDate() +"  "+ scheduledEventList.get(i).getUri()+"\"") ;
	  					buffWriter.newLine();
	  					buffWriter.append(doneEventList.get(j).getName() +"\"  "+ doneEventList.get(j).getDate() +"  "+ doneEventList.get(j).getUri()+"\"") ;
	  					buffWriter.newLine();
	  					buffWriter.append(" measure  = "+String.valueOf(df.format(simScore))) ;
	  					buffWriter.newLine();
	  					buffWriter.append(" state  = "+state) ;
	  					buffWriter.newLine();
	  					buffWriter.newLine();
	  					
	  					buffWriter.flush();
	  					
	  				}							
	  			}
	  		}					
	  	}	
	  	System.out.println("###################################################################");
	  	buffWriter.close();	  		  		   
	  }
	  
										  	/////////////////////////////////////////////////////////////////////
											///////// END OF PROCESSING & OUTPUT GENERATION PART //////////////
										  	/////////////////////////////////////////////////////////////////////								

    }
  }
