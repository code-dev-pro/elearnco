import { Button } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { QcModule } from "ui";
import TypographyBlockUI from "ui/typography/TypographyBlockUI";
import AnimatedFeedback from "../feedback";
import { EAnimationEffect, IRef } from "ui/confetti/types";
import Fireworks from "ui/confetti/Fireworks";
import ModulePreviewParagraph from "./modulePreviewParagraph";
import Tool from "../tool";

const feedback = {
  error: "Oops, you made a mistake. Try again!",
  correct: "Congratulations, you succeeded!",
};

const ModulePreviewQC = (props) => {
  const { type, instruction, text, uuid,id } = props;
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [resetData, setResetData] = useState();
  const [userData, setUserData] = useState<any>();
  const timeoutRef = useRef<number | null>(null);
  const ref = useRef<IRef | null>(null);

  const _onChange = (data): void => {
    setUserData(data);
  };

  const validateQuiz = (): void => {
    if (!userData || !text) {
      setMessage(feedback.error);
    } else if (userData.data.length !== text.data.length) {
      setMessage(feedback.error);
    } else {
      let allCorrect = true;
      for (let i = 0; i < userData.data.length; i++) {
        if (userData.data[i].isGood !== text.data[i].isGood) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        setMessage(feedback.correct);
        setIsEnd(true);
      } else {
        setMessage(feedback.error);
      }
    }

    setShowFeedback(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopAnimation();
      setShowFeedback(false);
    }, 3000);
  };

  const stopAnimation = useCallback((): void => {
    ref?.current?.stopAnimation();
  }, []);

  useEffect(() => {
    if (message === feedback.correct) {
      ref?.current?.startAnimation(EAnimationEffect.realist);
    }
  }, [message]);

  useEffect(() => {
    const resetData = {
      ...text,
      data: text.data.map((item) => ({
        ...item,
        isGood: false,
      })),
    };
    setResetData(resetData);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      style={{ pointerEvents: isEnd ? "none" : "auto" }}
    >
      <TypographyBlockUI>
        <div className="absolute w-full h-full z-20 pointer-events-none">
          <Fireworks ref={ref} />
        </div>

        <AnimatedFeedback
          message={message}
          isVisible={showFeedback}
          onAnimationComplete={() => void 0}
        />

        <TypographyBlockUI.Definition type={type}>
          <ModulePreviewParagraph text={instruction} />
          <Tool uuid={uuid} id={id}/>
          <div className="p-4">
            <QcModule
              type={text.type}
              onChange={(data) => _onChange(data)}
              content={resetData}
              isReadOnly
            />
            <div className="flex justify-end w-full mt-2">
              <Button isDisabled={isEnd} onClick={validateQuiz}>
                Valid
              </Button>
            </div>
          </div>
        </TypographyBlockUI.Definition>
      </TypographyBlockUI>
    </div>
  );
};

export default ModulePreviewQC;
