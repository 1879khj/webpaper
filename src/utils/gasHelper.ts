import { Board, Message } from '../types';

/**
 * Standard Google Apps Script Web App Template matching the PRD specification:
 * - Boards sheet: BoardID | Title | Recipient | Category | CreatedAt
 * - Messages sheet: BoardID | Sender | Content | Color | Emoji | CreatedAt
 */
export const GAS_SCRIPT_CODE = `/**
 * 마인드페이퍼 (MindPaper) Google Apps Script Web App 코드
 * Google 스프레드시트 > 확장 프로그램 > Apps Script에 아래 코드를 붙여넣은 후,
 * [배포] > [새 배포] > 유형: '웹 앱' > 액세스 권한: '모든 사용자(Anyone)'로 배포하세요.
 */

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Boards 시트 초기화 (PRD 정의: BoardID | Title | Recipient | Category | CreatedAt)
  var boardsSheet = ss.getSheetByName("Boards");
  if (!boardsSheet) {
    boardsSheet = ss.insertSheet("Boards");
    boardsSheet.appendRow(["BoardID", "Title", "Recipient", "Category", "CreatedAt"]);
    boardsSheet.setFrozenRows(1);
    boardsSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f4f6");
  }
  
  // 2. Messages 시트 초기화 (PRD 정의: BoardID | Sender | Content | Color | Emoji | CreatedAt)
  var messagesSheet = ss.getSheetByName("Messages");
  if (!messagesSheet) {
    messagesSheet = ss.insertSheet("Messages");
    messagesSheet.appendRow(["BoardID", "Sender", "Content", "Color", "Emoji", "CreatedAt"]);
    messagesSheet.setFrozenRows(1);
    messagesSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#f3f4f6");
  }
}

// GET 요청: 보드 목록 및 메시지 목록 조회
function doGet(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) || "get_all";
  var boardId = (e && e.parameter && e.parameter.boardId) || "";

  var result = { success: true };

  if (action === "get_boards" || action === "get_all") {
    var boardsSheet = ss.getSheetByName("Boards");
    var boardData = boardsSheet.getDataRange().getValues();
    var boards = [];
    for (var i = 1; i < boardData.length; i++) {
      if (boardData[i][0]) {
        boards.push({
          id: String(boardData[i][0]),
          title: String(boardData[i][1]),
          recipient: String(boardData[i][2]),
          category: String(boardData[i][3]),
          createdAt: String(boardData[i][4])
        });
      }
    }
    result.boards = boards;
  }

  if (action === "get_messages" || action === "get_all") {
    var messagesSheet = ss.getSheetByName("Messages");
    var msgData = messagesSheet.getDataRange().getValues();
    var messages = [];
    for (var j = 1; j < msgData.length; j++) {
      if (msgData[j][0]) {
        var rowBoardId = String(msgData[j][0]);
        if (!boardId || rowBoardId === boardId) {
          messages.push({
            id: "msg_" + j + "_" + Date.now(),
            boardId: rowBoardId,
            sender: String(msgData[j][1]),
            content: String(msgData[j][2]),
            color: String(msgData[j][3]),
            emoji: String(msgData[j][4]),
            createdAt: String(msgData[j][5]),
            likes: 0
          });
        }
      }
    }
    result.messages = messages;
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST 요청: 새 보드 생성 또는 새 메시지 추가
function doPost(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var action = data.action;

  if (action === "create_board") {
    var boardsSheet = ss.getSheetByName("Boards");
    var board = data.board;
    boardsSheet.appendRow([
      board.id,
      board.title,
      board.recipient,
      board.category,
      board.createdAt || new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Board created" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "add_message") {
    var messagesSheet = ss.getSheetByName("Messages");
    var msg = data.message;
    messagesSheet.appendRow([
      msg.boardId,
      msg.sender,
      msg.content,
      msg.color,
      msg.emoji,
      msg.createdAt || new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Message added" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export async function syncBoardToGAS(gasUrl: string, board: Board): Promise<boolean> {
  if (!gasUrl || !gasUrl.startsWith('http')) return false;
  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors', // Standard Google Apps Script Web App handling to bypass CORS
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'create_board',
        board: {
          id: board.id,
          title: board.title,
          recipient: board.recipient,
          category: board.category,
          createdAt: board.createdAt,
        },
      }),
    });
    return true;
  } catch (error) {
    console.warn('Failed to sync board to GAS:', error);
    return false;
  }
}

export async function syncMessageToGAS(gasUrl: string, message: Message): Promise<boolean> {
  if (!gasUrl || !gasUrl.startsWith('http')) return false;
  try {
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'add_message',
        message: {
          boardId: message.boardId,
          sender: message.sender,
          content: message.content,
          color: message.color,
          emoji: message.emoji,
          createdAt: message.createdAt,
        },
      }),
    });
    return true;
  } catch (error) {
    console.warn('Failed to sync message to GAS:', error);
    return false;
  }
}

export async function fetchAllFromGAS(gasUrl: string): Promise<{ boards?: Board[]; messages?: Message[] } | null> {
  if (!gasUrl || !gasUrl.startsWith('http')) return null;
  try {
    const url = new URL(gasUrl);
    url.searchParams.set('action', 'get_all');
    const res = await fetch(url.toString(), {
      method: 'GET',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (error) {
    console.warn('Failed to fetch from GAS:', error);
    return null;
  }
}
