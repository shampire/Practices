// This solves the readers/writers problem only using synchronized and the Lock class

public class CriticalResourceUsingSynchronizedAndLocks
{
     private     Integer     m_readLock = new Integer(0);
     private     int     m_reading =     0;
     private Lock m_writeLock = new Lock();
     public int global_int = 0;

     public int read()
     {
          int readData = 0;
          
          // lock readers
          synchronized( m_readLock )
          {
               // if we are the first reader lock writers

               if( m_reading == 0 )
                    // lock the writers
                    m_writeLock.lock();

               // increment semephore
               m_reading++;

          }     // unlock readers

          // do read  (may take significant time...)
          readData = global_int;

          // lock readers
          synchronized( m_readLock )
          {
               // decrement semaphore
               m_reading--;

               if( m_reading == 0 )
                    // release the writers
                    m_writeLock.releaseLock();

          }// unlock readers
          
          // return read value
          return readData; 
     }

     public void write( int x )
     {
          // lock writers
          m_writeLock.lock();

          // do writing
          global_int = x;

          // release writers
          m_writeLock.releaseLock();
     }
}

