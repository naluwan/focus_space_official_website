import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './index.css';

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
  id: string;
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  preload: 'auto',
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options, id }) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const player = React.useRef<videojs.Player>();
  const [videoId, setVideoId] = React.useState('');

  React.useEffect(() => {
    setVideoId(id);

    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (videoId) {
      player.current = videojs(videoNode.current, {
        ...initialOptions,
        ...options,
      }).ready(function () {
        // console.log('onPlayerReady', this);
      });
    }
  }, [videoId]);

  return (
    <div className='h-full'>
      <video ref={videoNode} className='video-js' playsInline>
        <track kind='captions' />
      </video>
    </div>
  );
};

export default VideoPlayer;
