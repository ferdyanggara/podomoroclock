import React, { useState } from 'react';
import Break from './components/Break';
import Session from './components/Session';
import TimeLeft from './components/TimeLeft';
import './assets/main.css';
import { useEffect } from 'react';
import { useRef } from 'react';

const App = () => {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [currentSessionType, setCurrentSessionType] = useState('Session');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  //   session or break
  const [sessionLength, setSessionLength] = useState(60 * 25);
  const [breakLength, setBreakLength] = useState(300);
  const [timeLeft, setTimeLeft] = useState(sessionLength);

  // change timeleft
  useEffect(() => {
    setTimeLeft(sessionLength);
  }, [sessionLength]);

  // Listen to timeleft changes
  useEffect(() => {
    // if timeleft is zero
    if (timeLeft === 0) {
      // play the audio
      audioElement?.current?.play();
      if (currentSessionType === 'Session') {
        setCurrentSessionType('Break');
        setTimeLeft(breakLength);
      } else if (currentSessionType === 'Break') {
        setCurrentSessionType('Session');
        setTimeLeft(sessionLength);
      }
    }
  }, [breakLength, currentSessionType, sessionLength, timeLeft]);
  // change session to break or break to session

  const decrementSessionLengthByOneMinute = () => {
    const newSessionLength = sessionLength - 60;

    if (newSessionLength > 0) {
      setSessionLength(newSessionLength);
    }
  };

  const decrementBreakLengthByOneMinute = () => {
    const newBreakLength = breakLength - 60;

    if (newBreakLength > 0) {
      setBreakLength(newBreakLength);
    }
  };

  const incrementSessionLengthByOneMinute = () => {
    const newSessionLength = sessionLength + 60;
    if (newSessionLength <= 60 * 60) {
      setSessionLength(newSessionLength);
    }
  };

  const incrementBreakLengthByOneMinute = () => {
    const newBreakLength = breakLength + 60;
    if (newBreakLength <= 60 * 60) {
      setBreakLength(newBreakLength);
    }
  };

  const isStarted = intervalId != null;

  const handleStartStopClick = () => {
    //   decrement timeledt by one every second(1000ms)
    // we'll use time setTimeInterval

    if (isStarted) {
      // if we are in started mode
      // we want to stoip the timer
      // clear interval
      if (intervalId) {
        clearInterval(intervalId);
      }

      setIntervalId(null);
    } else {
      //    if we are in stopped mode:
      // decrement timeleft by one every second(1000ms)
      // to do this we'll use setInterval
      const newIntervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  const handleResetButtonClick = () => {
    // reset audio
    audioElement?.current?.load();
    //clear the timeout interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    // set the intervalId null
    setIntervalId(null);
    // set the sessiontype to "sesssion"
    setCurrentSessionType('Session');
    // reset the session length to 25 minutes
    setSessionLength(60 * 25);
    // reset the break length to 25 minutes
    setBreakLength(60 * 5);
    // reset the timer to 25 minutes(initial session length)
    setTimeLeft(60 * 25);
  };

  return (
    <div className='flex flex-col h-screen items-center justify-center bg-green-700'>
      <div className='mb-10 text-xl text-gray-900 leading-tight '>
        Podomoro Clock
      </div>
      <div className='flex w-full justify-around'>
        <Break
          breakLength={breakLength}
          decrementBreakLengthByOneMinute={decrementBreakLengthByOneMinute}
          incrementBreakLengthByOneMinute={incrementBreakLengthByOneMinute}
        />

        <TimeLeft
          handleStartStopClick={handleStartStopClick}
          timerLabel={currentSessionType}
          startStopButtonLabel={isStarted ? 'Stop' : 'Start'}
          timeLeft={timeLeft}
          handleResetButtonClick={handleResetButtonClick}
        />
        <Session
          sessionLength={sessionLength}
          decrementSessionLengthByOneMinute={decrementSessionLengthByOneMinute}
          incrementSessionLengthByOneMinute={incrementSessionLengthByOneMinute}
        />
      </div>

      <audio id='beep' ref={audioElement}>
        <source src='https://kukuklok.com/audio/cock.mp3' type='audio/mpeg' />
      </audio>
    </div>
  );
};

export default App;
