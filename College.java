
public class College{ 

	private String name; 
	private int points;

	public College(String nm){ 
	   name = nm; 
       	   points = 0; 
    	} 

   	
    public String getName(){ 
    	return name; 
    }

   	public void addPoints(int i){ 
		points += i; 
	} 

	public void subtractPoints(int i){ 
		points -= i;
	} 

	public int getPoints(){ 
		return points; 
	} 

	public String toString(){ 
		return("College Name: " + this.getName() + " Points: " + this.getPoints()); 
	}
} 
 
