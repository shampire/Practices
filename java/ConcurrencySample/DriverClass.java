public class DriverClass {

    public static void main(String[] args) {
        System.out.println("Hello, World");
        CriticalResourceUsingSynchronizedAndLocks a = new CriticalResourceUsingSynchronizedAndLocks();
        a.write(2);
        int returnVal = a.read();
        System.out.println(Integer.toString(returnVal));
    }

}

