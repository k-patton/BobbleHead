import java.util.Scanner;
import java.util.ArrayList; 
import java.util.Collections; 

public class FindWinner{ 

	
    public static void main(String[] args){ 
	
		System.out.println("Hello! Welcome to the Bobble Head Winner Calculator!"); 
		
		Family f = new Family(1); 

		System.out.println("These are the colleges: "); 
		f.printCollegeList(); 


	/*

	Scanner scanner = new Scanner(System.in);
	int i = scanner.nextInt();  
	System.out.println("Would you like to import family? Type 1 for yes, 0 for no"); 
	

	if( i == 1){
		Family f = new Family(i); 
		fam = f; 	
	} 

	System.out.println("These are the colleges: "); 
	fam.printCollegeList(); 

	/*else{ 
		Family f = new Family(); 
		System.out.println("You have elected to add people and colleges manually"); 
	   	System.out.println("If there are no more people or colleges  to add type 'stop'"); 	
		boolean cont = true; 
		while(cont){ 
			String name = scanner.next(); 
			System.out.println("Name: "); 
			if (name.equals("stop")){  
				break;
			} 
			else{
			    f.addPerson(name); 
			} 
			
			String school = scanner.next(); 
			System.out.println("School: "); 
			if(school.equals("stop")){ 
				break;
			}
			else{ 
				College temp = new College(school); 
				f.addCollege(name,temp); 
			}
		} 
		fam = f; 
	} 
	
	System.out.println("These are the colleges: "); 
	fam.printCollegeList(); 

	*/
	
	} 

}











