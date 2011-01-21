class Lock extends Object
{
     private boolean m_bLocked = false;

     public synchronized void lock()
     {
          // if some other thread locked this object then we need to wait
          // until they release the lock
          if( m_bLocked )
          {
               do
               {
                    try
                    {
                         // this releases the synchronized that we are in
                         // then waits for a notify to be called in this object
                         // then does a synchronized again before continuing
                         wait();
                    }
                    catch( InterruptedException e )
                    {
                         e.printStackTrace();
                    }
                    catch( Exception e )
                    {
                         e.printStackTrace();
                    }
               } while( m_bLocked );     // we can't leave until we got the lock, which
                                             // we may not have got if an exception occured
          }

          m_bLocked = true;
     }

     public synchronized boolean lock( long milliSeconds )
     {
          if( m_bLocked )
          {
               try
               {
                    wait( milliSeconds );
               }
               catch( InterruptedException e )
               {
                    e.printStackTrace();
               }

               if( m_bLocked )
               {
                    return false;
               }
          }

          m_bLocked = true;
          return true;
     }

     public synchronized boolean lock( long milliSeconds, int nanoSeconds )
     {
          if( m_bLocked )
          {
               try
               {
                    wait( milliSeconds, nanoSeconds );
               }
               catch( InterruptedException e )
               {
                    e.printStackTrace();
               }

               if( m_bLocked )
               {
                    return false;
               }
          }

          m_bLocked = true;
          return true;
     }

     public synchronized void releaseLock()
     {
          if( m_bLocked )
          {
               m_bLocked = false;
               notify();
          }
     }

     public synchronized boolean isLocked()
     {
          return m_bLocked;
     }
}

        
