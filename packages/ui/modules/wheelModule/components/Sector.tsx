import { Button, Input } from "@nextui-org/react";
import { nanoid } from "nanoid";
import React, { ChangeEvent, useCallback } from "react";
import { IconUI } from "ui/icon/IconUI";

import { MAX_SECTORS, MIN_SECTORS, PROPS_BUTTON } from "../const";
import { IDataStamp, TDataStamp } from "../interface";

const Sectors = (props: IDataStamp) => {
  const { dataStamp = [], updateSector } = props;

  const _addTimeStep = useCallback((): void => {
    if (dataStamp.length < MAX_SECTORS) {
      const newdataStamp = {
        index: dataStamp.length + 1,
        time: 0,
        title: `Section ${dataStamp.length + 1}`,
        id: nanoid(7),
      };

      updateSector([...dataStamp, newdataStamp]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStamp]);

  const _removeTimeStep = useCallback(
    (id: string): void => {
      if (dataStamp.length > MIN_SECTORS) {
        const _newState = [...dataStamp].filter(
          (timeStep: TDataStamp) => timeStep.id !== id
        );
        [..._newState].forEach((timeStep: TDataStamp, i: number) => {
          timeStep.index = i + 1;
        });
        updateSector(_newState);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataStamp]
  );

  const _updateTimeStep = useCallback(
    (event: ChangeEvent<HTMLInputElement>, id: string): void => {
      const _target = event.currentTarget as HTMLInputElement;
      const _value = _target.value;
      const _newState = dataStamp.filter(
        (timeStep: TDataStamp) => timeStep.id === id
      );
      if (_newState.length) {
        Object.assign(_newState[0], {
          ..._newState[0],
          title: _value === "" ? "section" : _value,
        });

        updateSector([...dataStamp]);
      }
    },

    [dataStamp, updateSector]
  );

  return (
    <>
      <div className="flex flex-row justify-end items-center gap-3 mb-2 mt-5 w-full">
        <div className="flex gap-2">
          <Button
            startContent={<IconUI name="plus" {...PROPS_BUTTON} />}
            color="primary"
            variant="solid"
            onClick={_addTimeStep}
          >
            Add sector
          </Button>
        </div>
      </div>
      <div
        // style={{ display: "grid" }}
        className="grid grid-cols-4 gap-4 w-full bg-default-50 p-4"
      >
        {dataStamp?.map((step) => {
          return (
            <div
              key={step.id}
              className="flex justify-start items-center gap-2"
            >
              <div>
                <Input
                  onChange={(event): void => _updateTimeStep(event, step.id)}
                  placeholder={step.title}
                  value={step.title}
                  type="text"
                  label=""
                  size="sm"
                />
              </div>

              <div className="flex gap-1 justify-center">
                <Button
                  isIconOnly
                  onClick={(): void => _removeTimeStep(step.id)}
                  aria-label=""
                  startContent={<IconUI name="delete" {...PROPS_BUTTON} />}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Sectors;
