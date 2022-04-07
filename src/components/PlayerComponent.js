import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';

export default function PlayerComponent({
  video,
  i,
  currentVideoIndex,
  getNextVideo,
}) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    setPlay(false);
    ref.current.showPreview();
  }, [currentVideoIndex, i, video]);

  return (
    <ReactPlayer
      ref={ref}
      className="react-player"
      url={video.embeddedUrl}
      height="100%"
      width="100%"
      controls={true}
      playing={play}
      onPause={() => setPlay(false)}
      onPlay={() => setPlay(true)}
      onClickPreview={() => setPlay(true)}
      onEnded={getNextVideo}
      playsinline={true}
      light={true}
      // muted={true}
    />
  );
}
