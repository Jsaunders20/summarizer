const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const GPT_API_KEY = 'YOUR_API_KEY';

function extractAndGenerateDocuments(folderId) {
  const content = extractContentFromFiles(folderId);
  
  const summaryText = generateSummaryWithGPT4(content);
  const emailText = generateEmailWithGPT4(content);


  createDocumentInFolder(folderId, "Summary", summaryText);
  createDocumentInFolder(folderId, "Email", emailText);
}

function extractContentFromFiles(folderId) { // Renamed from extractContentFromPDFs
  const driveService = DriveApp;
  const folder = driveService.getFolderById(folderId);
  const files = folder.getFiles();
  let allText = "";


  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    Logger.log(mimeType)
    if (mimeType === 'application/pdf') {
      const blob = file.getBlob();
      const resource = {
        title: file.getName(),
        mimeType: 'application/pdf',
      };
      const options = {
        ocr: true,
        ocrLanguage: 'en',
      };
      const pdfFile = Drive.Files.insert(resource, blob, options);
      const pdfDocId = pdfFile.id;
      const googleDoc = DocumentApp.openById(pdfDocId);
      const text = googleDoc.getBody().getText();
      allText += "\n\n" + text;

      driveService.getFileById(pdfDocId).setTrashed(true);
    }
    // Handling audio files
     else if (mimeType === 'audio/mp3' || mimeType === 'audio/mp4' || mimeType === "audio/mpeg") {
        // Logger.log(audio)
        const audioBlob = file.getBlob();
        const transcribedText = WHISPER(audioBlob, 'en'); // Assuming the audio is in English
        allText += "\n\n" + transcribedText;
    }
  }
  Logger.log(allText)
  Logger.log(typeof(allText))
  return allText.slice(0, 12000);
}


function generateSummaryWithGPT4(content) {
  const prompt = `
    I have a collection of texts from a series of meeting documents. I need a 2-page summary divided into:
    - General Discussion
    - Action Items

    Be consice and to the point while trying to maintain as much of the original information. Output all information in a list format.
    
    Text:
    ${content}
  `;

  return generateWithGPT4(prompt);
}

function generateEmailWithGPT4(content) {
  const prompt = `
    Based on the following meeting documents, draft a follow-up email about the meeting.
    
    Text:
    ${content}
  `;

  return generateWithGPT4(prompt);
}

function generateWithGPT4(prompt) {
  const apiKey = GPT_API_KEY;
  const apiUrl = GPT_API_URL;

  const messages = [
    { "role": "system", "content": "You are an assistant that can extract and summarize meeting documents." },
    { "role": "user", "content": prompt }
  ];

  const payload = {
    'model': 'gpt-4',
    'messages': messages,
    'max_tokens': 1000
  };

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  };

  const requestOptions = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(payload),
  };

  const response = UrlFetchApp.fetch(apiUrl, requestOptions);
  const responseJson = JSON.parse(response.getContentText());
  return responseJson.choices[0].message.content.trim();
}

function createDocumentInFolder(folderId, title, content) {
  // Create a new Google Doc directly within the folder
  const folder = DriveApp.getFolderById(folderId);
  const doc = DocumentApp.create(title)
  const docid = doc.getId()

  DocumentApp.openById(docid).getBody().setText(content)

  moveFiles(docid,folderId)
}

function moveFiles(fileId, folderID) {
  var file = DriveApp.getFileById(fileId);
  var folder = DriveApp.getFolderById(folderID);
  file.moveTo(folder);
}




function runExtractionAndDocumentGeneration() {
  const specificFolderId = '1IP9kId1iAD8uAceiuP0GzNNlHHa-qzDF';
  extractAndGenerateDocuments(specificFolderId);
}
