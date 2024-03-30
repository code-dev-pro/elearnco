"use client";
import React from "react";

import { TagUI } from "../tag/TagUI";
import { TTagUI } from "../tag/types";



const ShareWithTrainer = (props:TTagUI) => {
  const { callback, forUserEmail } = props;
  return <TagUI callback={callback} forUserEmail={forUserEmail} section={[]} all={[]}/>
    
  
};

export default ShareWithTrainer;
