import { useEffect, useRef, useState } from "react";
import { Button } from "@material-ui/core";
import { floatToTimecodeString } from "utils";
import { ToolBar } from "@dataware-tools/app-common";
import WaveSurfer from "wavesurfer.js";
// @ts-expect-error Type-definitions are missing
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";
// @ts-expect-error Type-definitions are missing
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";

type AudioPreviewerProps = { url: string };
export const AudioPreviewer = ({ url }: AudioPreviewerProps): JSX.Element => {
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveformTimeline = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (waveformRef.current && waveformTimeline.current) {
      wavesurfer.current = WaveSurfer.create({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        container: waveformRef.current!,
        responsive: true,
        splitChannels: true,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              "background-color": "#000",
              color: "#fff",
              padding: "2px",
            },
          }),
          TimelinePlugin.create({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            container: waveformTimeline.current!,
          }),
        ],
      });

      wavesurfer.current.load(url);
      wavesurfer.current.on("audioprocess", () => {
        if (wavesurfer.current && wavesurfer.current.getCurrentTime())
          setCurrentTime(wavesurfer.current.getCurrentTime());
      });
      wavesurfer.current.on("seek", () => {
        if (wavesurfer.current && wavesurfer.current.getCurrentTime())
          setCurrentTime(wavesurfer.current.getCurrentTime());
      });
      wavesurfer.current.on("ready", () => {
        setIsReady(true);
        if (wavesurfer.current && wavesurfer.current.getDuration()) {
          setDuration(wavesurfer.current.getDuration());
        }
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    } else {
      return undefined;
    }
  }, [url, waveformRef, waveformTimeline]);

  return (
    <div>
      <div id="waveform" ref={waveformRef} style={{ position: "relative" }} />
      <div id="waveform-timeline" ref={waveformTimeline} />
      <ToolBar
        left={
          <Button
            onClick={() => {
              if (wavesurfer.current && wavesurfer.current?.isReady) {
                if (wavesurfer.current.isPlaying()) {
                  wavesurfer.current.pause();
                } else {
                  wavesurfer.current.play();
                }
              }
            }}
            disabled={!isReady}
          >
            Play / Pause
          </Button>
        }
        right={
          <p>
            {floatToTimecodeString(currentTime)} /{" "}
            {floatToTimecodeString(duration)}
          </p>
        }
      />
    </div>
  );
};
