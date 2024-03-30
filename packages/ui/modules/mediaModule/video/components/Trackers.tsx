import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { convertSecondsToTime, nanoid } from "lib";
import { APITypes } from "plyr-react";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { TTrackers } from "schemas";


const Trackers = ({
  getRef,
  onChange,
  data,
  isReadonly = false,
}: {
  getRef: () => APITypes | null;
  onChange: (data: any) => void;
  data: TTrackers[];
  isReadonly: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<TTrackers[]>(data);
  const [isOpen, setIsOpen] = React.useState(false);
  const markerRef = useRef<string>("");

  const _goToCurrentTime = (id: string): void => {
    const instance = getRef();

    if (instance) {
      const markerIndex = markers.findIndex((marker) => marker.id === id);

      if (markerIndex !== -1) {
        instance.plyr.currentTime = markers[markerIndex].time;
      }
    }
  };

  const _setOpen = (id: string): void => {
    markerRef.current = id;
    setIsOpen(true);
    _goToCurrentTime(id);
  };

  const _updateMarker = useCallback(
    (event: ChangeEvent<HTMLInputElement>, id: string): void => {
      const _target = event.currentTarget as HTMLInputElement;
      const _value = _target.value;
      const _newState = markers.filter((marker: TTrackers) => marker.id === id);
      if (_newState.length) {
        Object.assign(_newState[0], {
          ..._newState[0],
          label: _value === "" ? "Write you label..." : _value,
        });

        setMarkers([...markers]);
        onChange({ markers: [...markers] });
      }
    },

    [markers]
  );

  const _deleteMarker = useCallback(
    (id: string): void => {
      const _newState = [...markers].filter(
        (timeStep: TTrackers) => timeStep.id !== id
      );
      setIsOpen(false);
      setMarkers(_newState);
      onChange({ markers: _newState });
    },

    [markers]
  );

  const _addMarker = (): void => {
    const instance = getRef();

    if (instance && trackRef.current) {
      const currentTime = instance.plyr.currentTime;
      const width = trackRef.current.getBoundingClientRect().width;
      const duration = instance.plyr.duration;
      const x = (currentTime * width) / duration;
      const markerExists = markers.some(
        (marker) => marker.time === currentTime
      );
      if (!markerExists) {
        const newMarkers = [
          ...markers,
          { x: x, time: currentTime, id: nanoid(7), label: "" },
        ];
        setMarkers(newMarkers);
        onChange({ markers: newMarkers });
      }
    }
  };

  return (
    <div className="track-wrapper relative flex gap-2 items-center w-full mt-2">
      <div
        ref={trackRef}
        className="track flex w-full relative rounded-full bg-default-300/50 border-x-transparent h-1 my-[calc((theme(spacing.5)-theme(spacing.1))/2)]"
      >
        {markers.map((marker) => (
          <React.Fragment key={marker.id}>
            <Popover
              shouldCloseOnBlur
              shouldBlockScroll
              className="slot"
              shouldCloseOnInteractOutside={(e) => {
                if (markerRef.current !== "") {
                  setIsOpen(false);
                  return true;
                }

                if (e.classList.contains("slot")) {
                  return false;
                }
                setIsOpen(false);
                return true;
              }}
              isOpen={isOpen && marker.id === markerRef.current}
              placement="top"
              showArrow
              offset={20}
            >
              <PopoverTrigger>
                <div
                  onClick={(): void => _setOpen(marker.id)}
                  onDoubleClick={(): void => {!isReadonly &&_deleteMarker(marker.id)}}
                  style={{ transform: "translate(0%, -50%)", left: marker.x }}
                  className="slot flex justify-center items-center outline-none absolute  w-3 h-3 rounded-full bg-primary top-1/2 cursor-pointer border-0 shadow-small z-10"
                >
                  <div
                    style={{ fontSize: 9 }}
                    className="relative pointer-events-none top-5"
                  >
                    {convertSecondsToTime(marker.time)}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[240px]">
                {(titleProps) => (
                  <div className="px-1 py-2 w-full">
                    <p
                      className="text-small font-bold text-foreground"
                      {...titleProps}
                    >
                      Label
                    </p>
                    <div className="mt-2 flex flex-col gap-2 w-full">
                      <Input
                        readOnly={isReadonly}
                        defaultValue={marker.label}
                        placeholder="Write your label..."
                        label="Label"
                        size="sm"
                        variant="bordered"
                        onChange={(event): void =>
                          _updateMarker(event, marker.id)
                        }
                      />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </React.Fragment>
        ))}
      </div>
      {!isReadonly && (
        <Button onClick={_addMarker} size="sm">
          Add marker
        </Button>
      )}
    </div>
  );
};

export default Trackers;
