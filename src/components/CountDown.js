import React, {useState, useEffect} from 'react';
import {Timestamp} from 'firebase/firestore';
const CountDown = ({startDate}) => {
    const [counter, setCounter] = useState(Timestamp.fromDate(new Date()) - startDate-10);
  
    useEffect(() => {
      let timeoutId = setTimeout(() => setCounter(Timestamp.fromDate(new Date()) - startDate-10), 100);

      return () => {
        clearTimeout(timeoutId);
      }
    }, [counter, startDate]);
  
    return (
      <div>
        {counter &&
          <div>
            Your time: <br/>
            {Math.floor(counter/(60 * 60)) /*hours*/}
            :
            {Math.floor((counter/(60))%60) /*minutes*/}
            :
            {Math.floor(counter%60) /*seconds*/}
            :
            {Math.floor(((counter)*10)%10) /*milisecs*/}
          </div>
        }
      </div>
    );
}
export default CountDown;
