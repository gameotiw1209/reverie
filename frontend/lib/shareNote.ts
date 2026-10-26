import { toBlob } from "html-to-image";

type ShareNoteImageOptions = {
  element: HTMLElement;
  title: string;
};

function captureCloudBackground(): string {
  const source = document.querySelector<HTMLCanvasElement>(
    ".reverie-cloud-sky-canvas",
  );

  if (!source || source.width === 0 || source.height === 0) {
    throw new Error("The cloud background is not ready yet.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to capture the cloud background.");
  }

  context.drawImage(source, 0, 0);

  return canvas.toDataURL("image/png");
}

export async function shareNoteImage({
  element,
  title,
}: ShareNoteImageOptions): Promise<void> {
  if (!navigator.share || !navigator.canShare) {
    throw new Error(
      "Image sharing is not supported in this browser. Try a supported mobile browser.",
    );
  }

  await document.fonts.ready;

  const backgroundImage = captureCloudBackground();
  const previousBackground = element.style.backgroundImage;

  try {
    element.style.backgroundImage = `url("${backgroundImage}")`;

    const blob = await toBlob(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#005BFF",
    });

    if (!blob) {
      throw new Error("Unable to generate the note image.");
    }

    const file = new File([blob], "reverie-note.png", {
      type: "image/png",
    });

    if (!navigator.canShare({ files: [file] })) {
      throw new Error(
        "This browser cannot share PNG files through its native share sheet.",
      );
    }

    await navigator.share({
      title: title || "My Reverie note",
      files: [file],
    });
  } finally {
    element.style.backgroundImage = previousBackground;
  }
}