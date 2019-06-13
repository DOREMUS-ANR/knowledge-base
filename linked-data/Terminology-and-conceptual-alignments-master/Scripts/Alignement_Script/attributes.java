public class Concert {

	private String uri = "" ; 
	private String name = "" ; 
	private String date = "" ;
	public Concert(String u, String n, String d)
	{
		this.uri = u ; 
		this.name = n ; 
		this.date = d ;

	}
	
	public String getUri() {
		return uri;
	}
	public void setUri(String uri) {
		this.uri = uri;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	} 	

}
