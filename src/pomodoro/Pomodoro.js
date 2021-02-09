import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import { secondsToDuration } from "../utils/duration";
import { BreakDuration, FocusDuration } from "./timerDuration";
import PlayStopButtons from "./PlayStopButtons";

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialPlay, setInitialPlay] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  const [activeSession, setActiveSession] = useState(false);

  const [focusMins, setfocusMins] = useState(25);
  const [breakMins, setbreakMins] = useState(5);
  const [mins, setmins] = useState(25);
  const [sec, setsec] = useState(0);
  const [initialDuration, setInitialDuration] = useState(25);
  const [breakDurationInitial, setbreakDurationInitial] = useState(5);

  const [progressTimer, setprogressTimer] = useState(0);

  const focusTimeDecrease = () => {
    if (focusMins > 5 && !isTimerRunning && initialPlay)
      setfocusMins((min) => (min -= 5));
  };

  const focusTimeIncrease = () => {
    if (focusMins < 60 && !isTimerRunning && initialPlay)
      setfocusMins((min) => (min += 5));
  };

  const breakTimeDecrease = () => {
    if (breakMins > 1 && !isTimerRunning && initialPlay)
      setbreakMins((min) => (min -= 1));
  };

  const breakTimeIncrease = () => {
    if (breakMins < 15 && !isTimerRunning && initialPlay)
      setbreakMins((min) => (min += 1));
  };

  function percent(currentMinutes, currentSeconds, initialMinutes) {
    return (
      100 -
      ((currentMinutes * 60 + currentSeconds) / (initialMinutes * 60)) * 100
    );
  }
  function expireTime() {
    if (!onBreak) {
      new Audio(
        `https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-27787/zapsplat_bell_medium_large_soft_hit_chime_001_29436.mp3?_=1`
      ).play();
      setOnBreak((state) => (state = true));
      setprogressTimer((progress) => (progress = 0));
      setsec((sec) => (sec = 0));
      setmins((min) => (min = breakDurationInitial));
    } else {
      new Audio(
        `https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-two/household_alarm_clock_beep_tone.mp3?_=1`
      ).play();
      setOnBreak((state) => (state = false));
      setprogressTimer((progress) => (progress = 0));
      setsec((sec) => (sec = 0));
      setmins((min) => (min = initialDuration));
    }
  }

  useInterval(
    () => {
      setsec((sec) => {
        sec === 0 ? (sec = 59) : (sec -= 1); //seconds count down, cycles over minute
        if (sec === 59) setmins((minutes) => (minutes = mins - 1));
        return sec;
      });

      if (onBreak) {
        setprogressTimer(
          (currentProgress) =>
            (currentProgress = percent(mins, sec, breakDurationInitial))
        );
      } else {
        setprogressTimer(
          (currentProgress) =>
            (currentProgress = percent(mins, sec, initialDuration))
        );
      }

      if (mins === 0 && sec === 1) {
        expireTime();
      }
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    if (initialPlay) {
      setInitialDuration((duration) => (duration = focusMins));
      setbreakDurationInitial((duration) => (duration = breakMins));
      setmins((duration) => (duration = focusMins));
      setInitialPlay((state) => (state = false));
    }
    setActiveSession((state) => (state = true));
    setIsTimerRunning((prevState) => !prevState);
  }

  function stopButton() {
    setInitialPlay((state) => (state = true));
    setIsTimerRunning((state) => (state = false));
    setOnBreak((state) => (state = false));
    setActiveSession((state) => (state = false));

    setprogressTimer((progress) => (progress = 0));
    setsec((seconds) => (seconds = 0));
    setmins((duration) => (duration = focusMins));
    setInitialDuration((duration) => (duration = focusMins));
    setbreakDurationInitial((duration) => (duration = breakMins));
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <FocusDuration
          focusMins={focusMins}
          focusTimeDecrease={focusTimeDecrease}
          focusTimeIncrease={focusTimeIncrease}
        />
        <BreakDuration
          breakMins={breakMins}
          breakTimeDecrease={breakTimeDecrease}
          breakTimeIncrease={breakTimeIncrease}
        />
      </div>
      <PlayStopButtons
        playPause={playPause}
        classNames={classNames}
        isTimerRunning={isTimerRunning}
        stopButton={stopButton}
      />
      <div style={activeSession ? { display: "block" } : { display: "none" }}>
        <div className="row mb-2">
          <div className="col">
            <h2 data-testid="session-title">
              {!onBreak ? "Focusing" : "On Break"} for{" "}
              {!onBreak
                ? minutesToDuration(initialDuration)
                : minutesToDuration(breakDurationInitial)}{" "}
              minutes
            </h2>
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(mins * 60 + sec)} remaining
            </p>
            {!isTimerRunning ? <h2>PAUSED</h2> : null}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progressTimer}
                style={{ width: `${progressTimer}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
