
export enum EAnimationEffect  {
  cannon = 'cannon',
  fireworks = 'fireworks',
  snow = 'snow',
  realist = 'realist'

}

export type Timeout = NonNullable<NodeJS.Timeout>;

export interface IRef {
  startAnimation: (type: EAnimationEffect) => void;
  stopAnimation: () => void;
}
