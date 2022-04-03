import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import 'bootstrap/dist/css/bootstrap.css';
import 'videojs-youtube';

const MediaPlayer = ({
  currentClickId,
  currentVideoDetails,
  arrowClickedStack,
  setCurrentVideoDetails,
  getVideoArray,
}) => {
  const { playVideo, currentVideoArray, videoIndex } = currentVideoDetails;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(videoIndex);

  // set video index to 0 when changing truffle buttons
  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [currentVideoDetails]);

  const getNextVideo = () => {
    // increase index
    if (playVideo && currentVideoIndex < currentVideoArray.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
    // if at last video in array, go to zero index
    else if (playVideo && currentVideoIndex === currentVideoArray.length - 1) {
      setCurrentVideoIndex(0);
    } else {
      setCurrentVideoIndex(0);
      setCurrentVideoDetails({
        videoIndex: 0,
        currentVideoArray: getVideoArray(currentClickId),
        playVideo: true,
        controls: true,
        playsinline: true,
        file: {
          forceVideo: true,
        },
      });
    }
  };

  const getPrevVideo = () => {
    // decrease index
    if (playVideo && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
    // if at 0, go to last video in array
    else if (playVideo && currentVideoIndex === 0) {
      setCurrentVideoIndex(currentVideoArray.length - 1);
    } else {
      setCurrentVideoIndex(0);
      setCurrentVideoDetails({
        videoIndex: 0,
        currentVideoArray: getVideoArray(currentClickId),
        playVideo: true,
        controls: true,
        playsinline: true,
        file: {
          forceVideo: true,
        },
      });
    }
  };
  // enables swiping for videos
  useEffect(() => {
    let touchstartX = {
      value: 0,
      id: '',
    };
    let touchendX = 0;

    const screenArea = document.querySelector('.screenArea');
    function handleGesture() {
      if (touchendX < touchstartX.value) {
        getNextVideo();
      }
      if (touchendX > touchstartX.value) {
        getPrevVideo();
      }
    }
    function addTouchstartPosition(e) {
      if (
        e.target.id.includes('video-swipe-left') ||
        e.target.id.includes('video-swipe-right')
      ) {
        touchstartX.value = e.changedTouches[0].screenX;
        touchstartX.id = e.target.id;
      }
    }

    function addTouchendPosition(e) {
      if (
        touchstartX.id === 'video-swipe-right' ||
        touchstartX.id === 'video-swipe-left'
      ) {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
      }
    }

    screenArea.addEventListener('touchstart', addTouchstartPosition);
    screenArea.addEventListener('touchend', addTouchendPosition);

    return () => {
      screenArea.removeEventListener('touchstart', addTouchstartPosition);
      screenArea.removeEventListener('touchend', addTouchendPosition);
    };
  });

  // only enables the left/right buttons above 900px
  useEffect(() => {
    const windowWidth = window.matchMedia('(min-width: 500px)');

    if (windowWidth.matches) {
      if (currentClickId === 'leftArrow' || currentClickId === 'rightArrow') {
        if (playVideo && arrowClickedStack.length > 0) {
          const arrow = arrowClickedStack.pop();
          arrow === 'rightArrow' ? getNextVideo() : getPrevVideo();
        }
      }
    }
  });

  // enables carousel indicator lines
  useEffect(() => {
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselButtons = carouselIndicators.querySelectorAll(
      'button[type="button"]'
    );
    carouselButtons.forEach((button, i) => {
      button.addEventListener('click', () => {
        setCurrentVideoIndex(i);
      });
    });
  });

  useEffect(() => {
    console.log('changed video array')
    const blackOverlay = document.querySelector('.black-overlay');
    blackOverlay.style.display = 'block';
    console.log('hewwo');
    setTimeout(() => {
      blackOverlay.classList.add('black-overlay_hidden');
    }, 500);
    setTimeout(() => {
      blackOverlay.style.display = 'none';
      blackOverlay.classList.remove('black-overlay_hidden');
    }, 1000);
  }, [currentVideoArray]);

  const mediaPlayer = (
    <>
      <div className="black-overlay"></div>
      <div
        className="video-swipe video-swipe_right"
        id="video-swipe-right"
      ></div>
      <div className="video-swipe video-swipe_left" id="video-swipe-left"></div>
      <Carousel
        interval={null}
        controls={false}
        activeIndex={currentVideoIndex}
      >
        {currentVideoArray.map((video, i) => {
          return (
            <Carousel.Item
              key={i}
              // className={`${currentVideoIndex ? 'active' : ''}`}
            >
              {/* {video.is360 ? (
                <iframe src={video.embeddedUrl} className="vr-player" />
                // <VrPlayer
                //   video={video.embeddedUrl}
                //   currentVideoArray={currentVideoArray}
                // />
              ) : ( */}
              <ReactPlayer
                className="react-player"
                url={video.embeddedUrl}
                height="100%"
                width="100%"
                controls={true}
                playing={i === currentVideoIndex ? true : false}
                onEnded={getNextVideo}
                playsinline={true}
                // muted={true}
                light={(i === currentVideoIndex || i === currentVideoIndex + 1 || i === currentVideoIndex - 1) ? true : false}
              />
              {/* )} */}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </>
  );

  return mediaPlayer;
};

export default MediaPlayer;
