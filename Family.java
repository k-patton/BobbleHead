import java.util.ArrayList; 

public class Family{ 
	
	private ArrayList<Person> fam; 
	private ArrayList<College> schools; 

	public Family(int i){ 
		fam = new ArrayList<Person>(); 
		schools = new ArrayList<College>(); 

		Person Grandma = new Person("Grandma"); 
		College Tennessee = new College("Tennessee");  
		Grandma.addSchool(Tennessee); 
		fam.add(Grandma); 
		schools.add(Tennessee); 
		
		Person Rebecca = new Person("Rebecca"); 
		College Duke = new College("Duke"); 
		College Stanford = new College("Stanford"); 
		Rebecca.addSchool(Duke);
	    Rebecca.addSchool(Stanford); 	
		fam.add(Rebecca); 
		schools.add(Duke);
		schools.add(Stanford); 
		
		Person Tom = new Person("Tom"); 
		College Dartmouth = new College("Dartmouth"); 
		Tom.addSchool(Stanford); 
		Tom.addSchool(Dartmouth); 
		fam.add(Tom); 
		schools.add(Dartmouth); 




		
		//if(!schools.contains(Tenessee)){ 


	} 

	public Family(){ 
		fam = new ArrayList<Person>(); 
		schools = new ArrayList<College>(); 
	} 

	public void addPerson(String s){ 
		Person p = new Person(s); 
		fam.add(p); 
	} 

	public void addCollge(Person p, College c){ 
		p.addSchool(c); 
		if(!schools.contains(c)){ 
			schools.add(c); 
		} 
	} 

	public void printCollegeList(){ 
		for (int i = 0; i < schools.size(); i++){ 
			System.out.println(schools.get(i).getName()); 
		} 
	} 

	public void schoolPoints(int i){ }



	public void winnerIs(){ 

	} 

} 
	//problematic having college as College or string what do 


			
	

     


