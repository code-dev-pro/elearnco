/** MEDIA */
export enum EActionsMedia {
  PREVIEW = "Preview",
  ADD_FROM_USER = "Add from user",
  ADD_FROM_SERVICE = "Add from service",
  ADD_FROM_LIBRARY = "Add from library",
  DELETE = "Delete",
  UPDATE_IMAGE_BANNER = "Update image banner",
  FILL_IMAGE = "Fill image",
  FIT_IMAGE = "Fit image",
  UPATE_POSITION = "Updating position",
  EDIT = "Edit",
  COMMENT = "Comment",
}

export enum EActionskeysMedia {
  EDIT = "",
  PREVIEW = "",
  ADD_FROM_USER = "",
  ADD_FROM_SERVICE = "",
  ADD_FROM_LIBRARY = "",
  DELETE = "",
}
/** COURSE */
const EActionsCommunCourse = {
  EDIT: "Edit",
  PREVIEW: "Preview",
  SHARE: "Share",
  PATH :'Path'
} as const;

export const EActionsCourse = {
  ...EActionsCommunCourse,
  ADD: "Add",
  UNARCHIVE: "Unarchive",
  EDIT : "Edit course",
} as const;

export const EActionsCourseInFooterCard = {
  ...EActionsCommunCourse,
} as const;

export const EActionsMenuShortcuts={
  FEATURES : "Features",
  TIPS : "Tips",
} as const


export enum EActionskeysCourse {
  EDIT = "ctrl+E",
  PREVIEW = "ctrl+P",
  SHARE = "ctrl+S",
  ADD = "ctrl+A",
  DELETE = "ctrl+D",
}
export enum EActionsCourseInDrop {
  DUPLICATE = "Duplicate course",
  ARCHIVE = "Archive course",
  DELETE = "Delete course",
  
}
export enum EActionskeysFolder {
 
  ADD = "ctrl+F",
 
}
export enum EActionsFolder {
  ADD = "Add folder",
  RENAME = "Rename folder",
}

/** USER */
export enum EActionsUser {
  EDIT_PROFIL = "Edit profil",
  HELP = "Help",
  DELETE = "Delete",
  LOGOUT = "Log out",
  SETTINGS = "Settings",
}
export enum EActionskeysUser {
  EDIT_PROFIL = "ctrl+P",
  HELP = "ctrl+H",
  DELETE = "ctrl+Q",
  LOGOUT = "ctrl+D",
  SETTINGS = "ctrl+S",
}

/** PAGE */
export enum EActionsPage {
  PREVIEW = "Preview page",
  VALIDATE= "Validate page",
  DELETE = "Delete page",
  DUPLICATE = "Duplicate page",
  REORDER="Reorder pages",
}
export enum EActionskeysPage {
  DELETE = "E+P",
  DUPLICATE = "D+P",
}
/** COURSE - PAGE - PREVIEW */
export enum EActionPreview {
  DESKTOP = "desktop",
  TABLET = "tablet",
  MOBILE = "mobile",
}
export const EDeviceLayouts = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptopS: "1024px",
  laptopM: "1200px",
  laptopL: "1440px",
  desktopS: "1600px",
  desktopM: "2260px",
  desktopL: "2560px"
} as const

/** BLOCK */
export const EActionsBloc = {
  OPEN: 'Open block',
  CLOSE: 'Close block',
  DELETE: "Delete block",
  DUPLICATE: "Duplicate block",
  MOVEUP: "Move up",
  MOVEDOWN: "Move down",
  TOGGLE:"Toggle",
  IA:"",

 
} as const;
export enum EActionskeysBloc {
  DELETE = "E+B",
  DUPLICATE = "D+B",
  MOVEUP = "M+U",
  MOVEDOWN = "M+D",
  TOGGLE="",
  IA=""
}

