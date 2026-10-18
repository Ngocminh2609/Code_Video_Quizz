import React from 'react';
import { QuizComposition } from '../QuizComposition';
import { QuizCompositionProps } from '../types';

export type QuizVideoProps = QuizCompositionProps;

export const QuizVideo: React.FC<QuizVideoProps> = (props) => {
  return <QuizComposition {...props} />;
};
