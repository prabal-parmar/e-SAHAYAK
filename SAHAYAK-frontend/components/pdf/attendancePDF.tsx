import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

export const generateAttendancePDF = async (
  data: {
    workerId: string;
    name: string;
    Shift?: string;
    entryTime?: string;
    leavingTime?: string;
    overtimeEntry?: string | null;
    overtimeLeaving?: string | null;
  }[],
  date: string
) => {
  try {
    if (!data || data.length === 0)
      throw new Error("No data provided for PDF generation.");

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 30px;
              color: #2c3e50;
            }
            h1 {
              text-align: center;
              font-size: 22px;
              color: #1a237e;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              font-size: 13px;
            }
            th {
              background-color: #1976D2;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f4f6f8;
            }
            tr:hover {
              background-color: #e8f0fe;
            }
            footer {
              text-align: right;
              font-size: 11px;
              color: #777;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <h1>Attendance Report - ${date}</h1>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Worker ID</th>
                <th>Name</th>
                <th>Shift</th>
                <th>Entry Time</th>
                <th>Leaving Time</th>
                <th>OT Entry</th>
                <th>OT Leaving</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (w, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${w.workerId || "-"}</td>
                      <td>${w.name || "-"}</td>
                      <td>${w.Shift || "-"}</td>
                      <td>${w.entryTime || "-"}</td>
                      <td>${w.leavingTime || "-"}</td>
                      <td>${w.overtimeEntry || "-"}</td>
                      <td>${w.overtimeLeaving || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <footer>Generated on ${new Date().toLocaleString("en-GB")}</footer>
        </body>
      </html>
    `;

    const { uri: pdfUri } = await Print.printToFileAsync({ html });
    const fileName = `Attendance_${date.replace(/[/\\: ]/g, "_")}.pdf`;

    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Permission denied" });
        return;
      }

      const newUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.copyAsync({ from: pdfUri, to: newUri });

      const asset = await MediaLibrary.createAssetAsync(newUri);
      const folderName = "SRAM_Attendance";
      let album = await MediaLibrary.getAlbumAsync(folderName);
      if (!album) await MediaLibrary.createAlbumAsync(folderName, asset, false);
      else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);

      Toast.show({
        type: "success",
        text1: "Attendance PDF Saved ✅",
        text2: `Check folder: ${folderName}`,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          dialogTitle: "Share Attendance PDF",
        });
      }
    } else {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          dialogTitle: "Share Attendance PDF",
        });
      }
    }
  } catch (error: any) {
    console.error("PDF generation failed:", error);
    Toast.show({
      type: "error",
      text1: "PDF Generation Failed 😔",
      text2: error.message,
    });
  }
};
