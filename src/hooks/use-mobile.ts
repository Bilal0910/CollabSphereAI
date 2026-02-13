import { downloadBlob, generateFrameSnapshot } from "@/lib/frame-snapshot";
import { FrameShape, Shape } from "@/redux/slice/shapes";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export const useFrame = (shape: FrameShape) => {
  const dispatch = useAppDispatch();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const allShapes = useAppSelector((state) =>
    Object.values(state.shapes.shapes?.entities || {}).filter(
      (shape): shape is Shape => shape !== undefined,
    ),
  );

  const handleGenerateDesign = async () => {
    try {
      setIsGenerating(true);
      const snapshot = await generateFrameSnapshot(shape, allShapes);

      downloadBlob(snapshot, `frame-${shape.frameNumber}-snapshot.png`);

      const formData = new FormData();
      formData.append(
        "image",
        snapshot,
        `frame-${shape.frameNumber}-snapshot.png`,
      );
      formData.append("frameNumber", shape.frameNumber.toString());

      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get("project");
      if (projectId) {
        formData.append("projectId", projectId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateDesign,
  };
};
