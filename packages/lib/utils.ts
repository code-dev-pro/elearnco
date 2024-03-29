import { KbdKey } from "@nextui-org/react";
import { type ClassValue, clsx } from "clsx";
import * as DOMPurify from "isomorphic-dompurify";
import { customAlphabet } from "nanoid";
import { ChangeEvent } from "react";
// import * as CryptoJS from 'crypto-js';
import {
  ActivityBlockType,
  BLOCK_ACTIVITY_LIST,
  BLOCK_LOGIC_LIST,
  BLOCK_MEDIA_LIST,
  BLOCK_TEXT_LIST,
  BlockCategories,
  FileType,
  GenericObject,
  IBlobReturnType,
  LogicBlockType,
  MediaBlockType,
  TextBlockType,
  TFolder,
} from "schemas";
import { twMerge } from "tailwind-merge";
const sanitizer = DOMPurify.sanitize;
export const PATTERNS = [
  "Aare",
  "Clarence",
  "Doubs",
  "Hinterrhein",
  "Inn",
  "Kander",
  "Linth",
  "Mataura",
  "Mohaka",
  "Ngaruroro",
  "Oreti",
  "Rangitikei",
  "Reuss",
  "Rhone",
];
// WHAT ARE YOU DOING HERE ??
/* export const hash256 = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
}; */
export const isNotEmpty = (value: string | undefined | null): value is string =>
  value !== undefined && value !== null && value !== "";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);
//export const nanoid= (n:number)=>  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export const patternsObjects = PATTERNS.map((name) => ({
  id: nanoid(7),
  name: name,
  image: "/patterns/" + name + ".svg",
}));
const avartarsObjects = [...new Array(6)].map((_, index) => ({
  id: nanoid(7),
  name: `avatar_${index + 1}`,
  image: `avatar_${index + 1}`,
}));

export const avartarsTotalObjects = [
  ...avartarsObjects,
  {
    id: nanoid(7),
    name: "avatar_default",
    image: "default",
  },
];
export const generateConfirmationCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codeLength = 6;

  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);

    if (i === 2) {
      code += "-";
    }
  }

  return code;
};
export const concatElementsToString = (arr: (string | number)[]): string => {
  return arr.map((item) => String(item)).join("");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomDate(startDate: Date, endDate: Date): Date {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = Math.random() * (endTime - startTime) + startTime;
  return new Date(randomTime);
}

export function capitalizeFirstLetterOfEachWord(sentence: string): string {
  // Split the sentence into words
  if (sentence) {
    const words = sentence.split(" ");

    // Capitalize the first letter of each word and make the rest of the word lowercase
    const wordsWithCapitalizedFirstLetter = words.map((word) => {
      if (word.length === 0) {
        return word; // Do nothing for empty words
      }
      const capitalizedFirstLetter = word.charAt(0).toUpperCase();
      const restOfWordInLowercase = word.slice(1).toLowerCase();
      return capitalizedFirstLetter + restOfWordInLowercase;
    });

    // Join the words to form the modified sentence
    const modifiedSentence = wordsWithCapitalizedFirstLetter.join(" ");

    return modifiedSentence;
  }
  return "";
}

export const filterFolderAlphabetic = (liste: TFolder[]): TFolder[] => {
  liste.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return liste;
};
export function filterKeysFromString(inputString: string): {
  accepted: string[];
  rejected: string[];
} {
  if (!inputString) return { accepted: [], rejected: [] };
  const terms = inputString?.split("+").map((term) => term.trim());
  const allowedKeys = [
    "command",
    "shift",
    "ctrl",
    "option",
    "enter",
    "delete",
    "escape",
    "tab",
    "capslock",
    "up",
    "right",
    "down",
    "left",
    "pageup",
    "pagedown",
    "home",
    "end",
    "help",
    "space",
  ];

  const acceptedTerms: string[] = [];
  const rejectedTerms: string[] = [];

  for (const term of terms) {
    if (allowedKeys.includes(term as KbdKey)) {
      acceptedTerms.push(term);
    } else {
      rejectedTerms.push(term);
    }
  }

  return { accepted: acceptedTerms as KbdKey[], rejected: rejectedTerms };
}

export function createCollectionFromEnums(
  actionsEnum: Record<string, string>,
  keysEnum: Record<string, string>
): { action: string; key: string }[] {
  const actionsKeys = Object.keys(actionsEnum);

  const collection = actionsKeys.map((key) => ({
    action: actionsEnum[key],
    key: keysEnum[key],
  }));

  return collection;
}
export function matchRoute(pathname: string, route: string): boolean {
  const pathnameWithoutQuery = pathname.split("?")[0];
  const routeWithoutQuery = route.split("?")[0];

  return (
    pathname.includes(route) ||
    pathnameWithoutQuery.includes(routeWithoutQuery) ||
    pathnameWithoutQuery === `/${routeWithoutQuery}`
  );
}
export const computeNearestPlaceholderIndex = (
  offsetY: number,
  placeholderRefs: React.MutableRefObject<HTMLDivElement[]>
) => {
  const { closestIndex } = placeholderRefs.current.reduce(
    (prev, elem, index) => {
      const elementTop = elem.getBoundingClientRect().top + window.scrollY;
      const mouseDistanceFromPlaceholder = Math.abs(offsetY - elementTop);
      return mouseDistanceFromPlaceholder < prev.value
        ? { closestIndex: index, value: mouseDistanceFromPlaceholder }
        : prev;
    },
    { closestIndex: 0, value: 999999999999 }
  );
  return closestIndex;
};

export const getId = (data: GenericObject[], name: string): string => {
  const result = data.filter(
    (item: GenericObject) => name === (item.value || item.name)
  );

  if (result.length > 0) {
    return result[0].id as string;
  }
  return "";
};
export function convertBytesToKB(bytes: number): number {
  const kb = bytes / 1024;
  return kb;
}

interface IParseType {
  blob: GenericObject;
  name: string;
  data: GenericObject;
}

export function getGreeting(): string {
  const currentHour: number = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

enum Season {
  SPRING = "spring",
  SUMMER = "summer",
  AUTUMN = "autumn",
  WINTER = "winter",
}
interface SeasonalImage {
  season: Season;
  imageUrl: string;
}
const seasonalMessages = new Map<Season, string[]>([
  [
    Season.SPRING,
    ["Welcome to spring courses!", "Spring is the time for new beginnings!"],
  ],
  [
    Season.SUMMER,
    [
      "Enjoy your summer learning with us!",
      "Summer is the perfect time to learn!",
    ],
  ],
  [
    Season.AUTUMN,
    [
      "Fall into learning this autumn!",
      "Autumn is a season of change and growth!",
    ],
  ],
  [
    Season.WINTER,
    [
      "Warm up your winter with our courses!",
      "Winter is a great time to expand your knowledge!",
    ],
  ],
]);
const seasonalImages: SeasonalImage[] = [
  {
    season: Season.SPRING,
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/10/24/09/35/autumn-1765636_1280.jpg",
  },
  {
    season: Season.SUMMER,
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/10/24/09/35/autumn-1765636_1280.jpg",
  },
  {
    season: Season.AUTUMN,
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/10/24/09/35/autumn-1765636_1280.jpg",
  },
  {
    season: Season.WINTER,
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/10/24/09/35/autumn-1765636_1280.jpg",
  },
];
function getSeason(): Season {
  const date: Date = new Date();
  const month: number = date.getMonth() + 1; // Mois indexé à partir de 0

  if (month >= 3 && month <= 5) {
    return Season.SPRING;
  } else if (month >= 6 && month <= 8) {
    return Season.SUMMER;
  } else if (month >= 9 && month <= 11) {
    return Season.AUTUMN;
  } else {
    return Season.WINTER;
  }
}
export function getImageForSeason(): string {
  const season = getSeason();
  const matchedImage = seasonalImages.find((image) => image.season === season);
  if (matchedImage) return matchedImage?.imageUrl;
  return "https://cdn.pixabay.com/photo/2016/10/24/09/35/autumn-1765636_1280.jpg";
}
export function getRandomMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Obtenir la saison actuelle
const currentSeason: Season = getSeason();

// Obtenir les messages associés à la saison actuelle
export const messagesForCurrentSeason: string[] =
  seasonalMessages.get(currentSeason) || [];

export function handleParseData(props: IParseType): IBlobReturnType {
  const newData = {
    ...JSON.parse(JSON.stringify(props.blob)),
    [props.name]: props.data,
  };
  return newData as GenericObject;
}

interface FileValidationType {
  fileType: FileType;
  event: ChangeEvent<HTMLInputElement> | GenericObject;
  handleError: (props: GenericObject) => void;
}
export const handleFileTypeValidations = ({
  fileType,
  handleError,
}: FileValidationType) => {
  try {
    handleError({
      error: {
        message: "Invalid file Type",
        fileTypes: fileType,
      },
    });
    throw new Error("Invalid file Type");
  } catch (error) {
    throw new Error("Error");
  }
};

interface MaxFileValidationType {
  maxFile: number;
  fileState: GenericObject;
  name: string;
  handleError: (props: GenericObject) => void;
}

export const handleMaxFileLimitError = (props: MaxFileValidationType) => {
  try {
    props.handleError({
      error: {
        message: "Exceeded File Limit",
        limit: props.maxFile,
      },
    });

    throw Error("Exceeded File Limit");
  } catch (error) {
    console.log(error);
  }
};

interface IGenericErrorType {
  message: string;
  handleError: (props: GenericObject) => void;
}

export const handleGenericError = (props: IGenericErrorType) => {
  try {
    props.handleError({
      error: {
        message: props.message,
      },
    });
    throw Error(props.message);
  } catch (error) {
    console.log(error);
  }
};

export function getAspectRatio(image: HTMLImageElement): number {
  const w = image?.naturalWidth;
  const h = image?.naturalHeight;

  let aspectRatio;

  if (w > h) {
    aspectRatio = w / h;
  } else {
    aspectRatio = h / w;
  }

  return aspectRatio;
}
const httpsRegex = /^https:\/\//;
const blobRegex = /^blob:/;
const base64Regex = /^data:image\/\w+;base64,/;
export function checkHttps(url: string): boolean {
  return httpsRegex.test(url) || blobRegex.test(url) || base64Regex.test(url);
}

export function getParamsFromUrlImage(url: string): {
  x: number;
  y: number;
  mode: "fit" | "fill";
} {
  const urlParams = new URLSearchParams(url);
  return {
    x: Number(urlParams.get("x")) || 0,
    y: Number(urlParams.get("y")) || 0,
    mode: (urlParams.get("mode") as "fit") || "fill",
  };
}

export function updateImageUrl(
  originalUrl: string,
  newX: number,
  newY: number,
  newMode: string
): string {
  let updatedUrl = "";
  if (base64Regex.test(originalUrl)) {
    updatedUrl = `${originalUrl}?x=${newX}&y=${newY}&mode=${newMode}`;
  } else {
    const url = new URL(originalUrl);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set("x", newX.toString());
    searchParams.set("y", newY.toString());
    searchParams.set("mode", newMode);
    url.search = searchParams.toString();
    updatedUrl = url.toString();
  }

  return updatedUrl;
}

export const getBlockColor = (
  category: string
): {
  color: string;
  backgroundColor:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
} => {
  if (
    category === (BlockCategories.text as string) ||
    BLOCK_TEXT_LIST.includes(category as TextBlockType)
  ) {
    return {
      color: "#1273e8",
      backgroundColor: "primary",
    };
  } else if (
    category === (BlockCategories.media as string) ||
    BLOCK_MEDIA_LIST.includes(category as MediaBlockType)
  ) {
    return {
      color: "#8c5ecd",
      backgroundColor: "secondary",
    };
  } else if (
    category === (BlockCategories.logic as string) ||
    BLOCK_LOGIC_LIST.includes(category as LogicBlockType)
  ) {
    return {
      color: "#eea743",
      backgroundColor: "warning",
    };
  } else if (
    category === (BlockCategories.activity as string) ||
    BLOCK_ACTIVITY_LIST.includes(category as ActivityBlockType)
  ) {
    return {
      color: "#51c46f",
      backgroundColor: "success",
    };
  }
  return {
    color: "#fff",
    backgroundColor: "success",
  };
};

export function reorganizePerIndex(
  collection: GenericObject[]
): GenericObject[] {
  const sortedCollection = collection.sort((a, b) => a.index - b.index);

  return sortedCollection;
}

// Function to add an object at a specific index
export function addObjectAtIndex<T extends GenericObject>(
  array: T[],
  index: number,
  newObject: T
): T[] {
  const newArray = [...array];
  newArray.splice(index, 0, newObject);
  return newArray.map((object, index) => ({ ...object, index }));
}

// Function to remove an object by its id
export function removeObjectById<T extends GenericObject>(
  array: T[],
  id: string
): T[] {
  return array.filter((object) => object.uuid !== id && object.id !== id);
}

// Function to update an object by its id
export function updateObjectById<T extends GenericObject>(
  array: T[],
  id: string,
  newProperties: Partial<T>
): T[] {
  return array.map((object) =>
    object.uuid === id || object.id === id
      ? { ...object, ...newProperties }
      : object
  );
}

// Function to reorganize the indexes in the array
export function reorganizeIndexes<T extends GenericObject>(
  array: T[],
  n: number = 0
): T[] {
  return array.map((object, index) => ({ ...object, index: index + n }));
}

// Function to find an object by its id
export function findObjectById<T extends GenericObject>(
  array: T[],
  id: string
): T | undefined {
  return array.find((obj) => obj.uuid === id || obj.id === id);
}

export function reorderObjectById<T extends GenericObject>(
  array: T[],
  id: string,
  newIndex: number
) {
  const objectToReorder = array.find(
    (object) => (object.uuid || object.id) === id
  );
  if (objectToReorder) {
    const newArray = [...array];
    const currentIndex = newArray.indexOf(objectToReorder);

    if (currentIndex !== -1) {
      newArray.splice(currentIndex, 1);

      newArray.splice(newIndex, 0, objectToReorder);

      return newArray.map((object, index) => ({ ...object, index }));
    }
  }

  return array;
}

// Function to swap two objects in the array by their ids
export function swapObjectsById(
  array: GenericObject[],
  id: string,
  direction: "up" | "down"
): GenericObject[] {
  const objectToSwap = array.find((obj) => obj.uuid === id || obj.id === id);

  if (objectToSwap) {
    const currentIndex = array.indexOf(objectToSwap);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex >= 0 && swapIndex < array.length) {
      const newArray = [...array];
      [newArray[currentIndex], newArray[swapIndex]] = [
        newArray[swapIndex],
        newArray[currentIndex],
      ];

      return newArray.map((object, index) => ({ ...object, index }));
    }
  }

  return array;
}

export const changeCursor = (newCursor: string): void => {
  document.body.style.cssText = `cursor: ${newCursor};overflow:hidden;`;
};

export const resetCursor = (): void => {
  document.body.style.cssText = `cursor: default;overflow:hidden;`;
};
/**
 * It takes a string, sanitizes it, and returns the sanitized string
 * @param {string} str - The string to be cleaned.
 * @returns A function that takes a string and returns a sanitized string.
 */
export const clean = (str: string): string => {
  return sanitizer(str);
};

/**
 * The function `getCourseId` takes a string representing a URL pathname and returns the last segment
 * of the pathname, which is assumed to be a course ID.
 * @param {string} pathname - The `pathname` parameter is a string that represents the current URL
 * path.
 * @returns the course ID, which is extracted from the given pathname.
 */
export const getCourseId = (pathname: string): string => {
  return pathname?.substring(pathname.lastIndexOf("/") + 1);
};

/**
 * The function `isFileImage` checks if a given file is an image by checking its file extension or if
 * it contains specific image-related strings.
 * @param {string} file - The `file` parameter is a string that represents the file name or file path.
 * @returns a boolean value.
 */
export const isFileImage = (file: string): boolean => {
  return (
    file?.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null ||
    file.includes("data:image/jpeg;base64") ||
    file.includes("data:image/png;base64") ||
    file.includes("images.unsplash.com")
  );
};
export const isFileVideo = (file: string): boolean => {
  return file?.match(/\.(mp4|mov)$/) !== null || file.includes("youtube");
};
/**
 * The function `videoGetID` takes a YouTube video URL as input and returns the video ID.
 * @param {string} url - The `url` parameter is a string that represents the URL of a YouTube video.
 * @returns the ID of a YouTube video based on the provided URL.
 */
export const videoGetID = (url: string): string => {
  const url_split = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return url_split[2] !== undefined
    ? url_split[2].split(/[^0-9a-z_-]/i)[0]
    : url_split[0];
};

/**
 * The function appends a unit (default is "px") to a number or string value.
 * @param {number | string} value - The `value` parameter can be either a number or a string.
 * @param [unit=px] - The `unit` parameter is a string that represents the unit of measurement to be
 * appended to the `value`. By default, it is set to "px", which stands for pixels. However, you can
 * provide a different unit if needed.
 * @returns a string that concatenates the value and the unit.
 */
export const appendUnit = (value: number | string, unit = "px") => {
  return `${value}${unit}`;
};

export function compareCollections(
  collection1: GenericObject[],
  collection2: GenericObject[]
): GenericObject[] {
  const mapCollection1 = new Map<string, GenericObject>();

  collection1.forEach((obj) => {
    mapCollection1.set(obj.uuid, obj);
  });

  const differentIndexObjects = collection2.filter((obj) => {
    const correspondingObjInCollection1 = mapCollection1.get(obj.uuid);

    return (
      correspondingObjInCollection1 &&
      correspondingObjInCollection1.index !== obj.index
    );
  });

  return differentIndexObjects;
}

export const cleanBase64String = (base64String: string) => {
  const cleanString = base64String.replace(/^data:video\/mp4;base64,/, "");
  const validBase64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const cleanedBase64 = cleanString
    .split("")
    .filter((char) => validBase64Chars.includes(char))
    .join("");

  return cleanedBase64;
};
export const base64toBlob = (base64Data: string): Blob => {
  const byteCharacters = atob(cleanBase64String(base64Data));
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  return new Blob([byteArray], { type: "video/mp4" });
};

export const removeHTMLTagsAndQuotes = (text: string): string => {
  const regex = /<\/?[^>]+>|^"|"$|"/g;
  return text?.replace(regex, "");
};

export function randomDraw(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export function encryptKey(key: string, password: string): string {
//   return CryptoJS.AES.encrypt(key, password).toString();
// }

// export function decryptKey(encryptedKey: string, password: string): string {
//   const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
//   return bytes.toString(CryptoJS.enc.Utf8);
// }

// A wrapper for "JSON.parse()"" to support "undefined" value
export function parseJSON<T>(value: string | null): T | undefined {
  try {
    const val = value === "undefined" ? undefined : JSON.parse(value ?? "");
    return val as undefined | T;
  } catch {
    return undefined;
  }
}
