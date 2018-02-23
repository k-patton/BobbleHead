import java.util.Scanner; 
import java.util.ArrayList; 

public class Person{ 
    
    private ArrayList<College> schools; 
    private String name; 
    private int points; 

    public Person(String nm){ 
	name = nm; 
	schools = new ArrayList<College>(); 
	points = 0; 
    } 


    public void addSchool(College c){ 
       //maybe change arraylist to string? 
       schools.add(c); 
    } 

    public void changePoints(int i){ 
	points += i; 
    } 

   // public void getScore()
} 
