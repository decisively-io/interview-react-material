import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
//import { useNotification } from "@common/notifications";
import GetAppIcon from "@material-ui/icons/GetApp";
import React from "react";
import { useInterviewContext } from "..";
import { RotatingCachedIcon } from "../../util";

const uuidRegex = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const dataRefRegex = new RegExp(`^data:id=(${uuidRegex});base64,([-A-Za-z0-9+/=]*)$`);

// @ts-ignore
export const DownloadFileButton = ({ reference, hideName, className = undefined }) => {
  const { session } = useInterviewContext();
  if (!reference) return <span />;

  const refMatch = reference?.match(dataRefRegex);
  let fileName: string;
  try {
    fileName = refMatch[2] ? atob(refMatch[2]) : "";
  } catch (error) {
    console.log("Error checking reference");
    return <span />;
  }
  const [isDownloading, setIsDownloading] = React.useState(false);
  //const notify = useNotification();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDownloading(true);
    let response: any;
    try {
      response = await session.downloadFile(reference);
    } catch (error: any) {
      console.log(error);
      setIsDownloading(false);
      //notify.error(`Error downloading the file: details: ${error.message}`);
      return;
    }
    if (!response || !response.data) {
      setIsDownloading(false);
      //notify.error(`Error downloading the file: no data from server`);
    }
    const [prefix, fileData] = response.data.split(";base64,");
    const mimeType = prefix.split(";")[0].replace("data:", "");
    const buffer = Buffer.from(fileData, "base64");
    const blob = new Blob([buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  if (hideName) {
    return (
      <IconButton
        onClick={handleClick}
        disabled={isDownloading}
        size="small"
        className={className}
      >
        {isDownloading ? <RotatingCachedIcon /> : <GetAppIcon />}
      </IconButton>
    );
  } else {
    return (
      <Button
        variant="text"
        onClick={handleClick}
        disabled={isDownloading}
        startIcon={isDownloading ? <RotatingCachedIcon /> : <GetAppIcon />}
      >
        {fileName}
      </Button>
    );
  }
};
