"use client";
import { useEffect } from "react";
import Script from "next/script";

interface FeaturebaseFunction {
  (...args: any[]): void;
  q?: any[];
}

interface CustomWindow extends Window {
  Featurebase?: FeaturebaseFunction;
}
export const Feedbacks = () => {
  useEffect(() => {
    const win: CustomWindow = window;

    if (!win.Featurebase || typeof win.Featurebase !== "function") {
      win.Featurebase = function (...args: any[]) {
        const featurebaseQ = win.Featurebase!.q || [];
        featurebaseQ.push(args);
        win.Featurebase!.q = featurebaseQ;
      };
    }
    win.Featurebase("initialize_portal_widget", {
      organization: "elearnco", // required
      placement: "right", // optional
      fullScreen: false, // optional
      initialPage: "MainView", // optional (MainView, RoadmapView, CreatePost, PostsView, ChangelogView)
    });
  }, []);

  return (
    <>
      <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
    </>
  );
};


