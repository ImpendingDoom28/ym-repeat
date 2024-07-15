import { useCallback, useEffect, useState } from 'react'

// ClientX важен при "mousedown" событии
let mouseDownEvent = new MouseEvent(
  "mousedown", 
{ bubbles: true, cancelable: true, view: window, clientX: 0 }
);
const mouseUpEvent = new MouseEvent(
  "mouseup", 
{ bubbles: true, cancelable: true, view: window }
);

function App() {
  const [repeatStartTime, setRepeatStartTime] = useState<string>('0');
  const [windowSizes, setWindowSizes] = useState<{ width: number, height: number}>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [trackName, setTrackName] = useState<Element | null>(null);
  const [trackImage, setTrackImage] = useState<Element | null>(null);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [progress, setProgress] = useState<Element | null>(null);

  const handleKeyboardPress = useCallback((e: KeyboardEvent) => {
    if (progress && e.code === "KeyR" && document.getElementById("repeat-extension")?.dataset.show === 'true') {
      const startTime = +repeatStartTime;
      const newClientX = (windowSizes.width / trackDuration) * startTime
      mouseDownEvent = new MouseEvent(
        "mousedown", 
        { bubbles: true, cancelable: true, view: window, clientX: newClientX }
      );
      progress.dispatchEvent(mouseDownEvent);
      progress.dispatchEvent(mouseUpEvent);
    }
  }, [progress, repeatStartTime, windowSizes.width, mouseDownEvent, trackDuration]);

  const updateTrack = () => {
    const trackName = document.querySelector('.track__name');
    trackName && setTrackName(trackName);
    const trackImage = document.querySelector("div.entity-cover.deco-entity-image-placeholder.track-cover.entity-cover_size_Large");
    trackImage && setTrackImage(trackImage);
    const trackProgress = document.querySelector("div.player-progress.progress.deco-progress.progress_branding > div.progress__bar.progress__text");
    if (trackProgress) {
      setProgress(trackProgress);
      setTrackDuration(+((trackProgress as HTMLElement).dataset.duration ?? 0));
    }
  }

  useEffect(() => {
    updateTrack();
    
    const handleResize = () => {
      setWindowSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardPress);

    return () => {
      window.removeEventListener('keydown', handleKeyboardPress);
    }
  }, [handleKeyboardPress]);

  const onRepeatTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.value === "") {
      setRepeatStartTime("");
      return;
    }

    if (/^[1-9][0-9]*$/.test(event.target?.value)) {
      const value = +event.target.value;

      if (value >= trackDuration) {
        setRepeatStartTime(`${trackDuration.toFixed(0)}`);
      } else if (value <= 0) {
        setRepeatStartTime(`0`);
      } else {
        setRepeatStartTime(`${value}`);
      }
    }
  }
  
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: '20px', lineHeight: '28px' }}>
          <span style={{ color: 'yellowgreen' }}>{"Рипит"}</span>{" - повторитель трека"}
        </h1>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
            <h3>{"Информация о треке"}</h3>
            <button 
              style={{
                appearance: "none",
                border: "none",
                background: "none",
                color: "yellowgreen",
                cursor: "pointer",
              }}
              onClick={updateTrack}
            >
              {"Обновить"}
            </button>
          </div>
          <div 
            id="track-info" 
            style={{ 
              position: "relative",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%"
            }}
          >
            {trackImage && (
              <div
                style={{ display: 'flex' }}
                dangerouslySetInnerHTML={{ __html: trackImage.innerHTML }}
              />
            )}
            {trackName && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  position: "absolute",
                  top: "24px",
                  left: "52px",
                  width: "calc(100% - 50px)"
                }}
                dangerouslySetInnerHTML={{ __html: trackName.innerHTML }} 
              />
            )}
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '8px'}}>{"Настройки"}</h3>
          <div>
            <label 
              style={{
                width: "100%",
                flexDirection: "column",
                display: "flex",
              }}
            >
              {"Введите время начала повтора (в секундах):"}
              <input 
                type="text" 
                value={repeatStartTime}
                onChange={onRepeatTimeChange}
                style={{
                  marginTop: "4px",
                  padding: "4px 8px",
                  fontSize: "14px",
                  display: "flex",
                  flex: "1"
                  }}
              />
            </label>
            {trackDuration !== 0 ? (
              <div style={{ width: "100%", paddingTop: "4px" }}>
                {`Длительность трека: ${trackDuration.toFixed(0)} секунд`}
              </div>
            ) : (
              <div style={{ width: "100%", paddingTop: "4px", color: '#FF4844' }}>
                {"Не удалось получить длительность трека, попробуйте обновить"}
              </div>
            )}
            <div style={{ color: "#bbbbbb", textAlign: "end", position: "relative" }}>
              <i 
                style={{ 
                  position: "absolute", 
                  right: "0", 
                  top: trackDuration === 0 ? "0" : "15px" 
                }}
              >
                {"Кнопка для повтора - R"}
              </i>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App
