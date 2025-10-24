import { Message, MessageHistory } from '@/types';

/**
 * 메시지 트리를 순회하여 flat list로 변환
 */
export function traverseMessageTree(
  history: MessageHistory,
  startMessageId?: string | null
): Message[] {
  const result: Message[] = [];

  const traverse = (messageId: string | null) => {
    if (!messageId || !history[messageId]) return;

    const message = history[messageId];
    result.push(message);

    // 첫 번째 자식만 탐색 (기본 경로)
    if (message.childrenIds && message.childrenIds.length > 0) {
      traverse(message.childrenIds[0]);
    }
  };

  // 루트 메시지부터 시작
  if (startMessageId) {
    traverse(startMessageId);
  } else {
    // 루트 메시지 찾기 (parentId가 null인 메시지)
    const rootMessages = Object.values(history).filter(
      (msg) => msg.parentId === null
    );
    rootMessages.forEach((msg) => traverse(msg.id));
  }

  return result;
}

/**
 * 메시지의 모든 자손을 찾기
 */
export function findDescendants(
  history: MessageHistory,
  messageId: string
): string[] {
  const descendants: string[] = [];

  const traverse = (id: string) => {
    const message = history[id];
    if (!message) return;

    message.childrenIds.forEach((childId) => {
      descendants.push(childId);
      traverse(childId);
    });
  };

  traverse(messageId);
  return descendants;
}

/**
 * 메시지의 모든 조상을 찾기
 */
export function findAncestors(
  history: MessageHistory,
  messageId: string
): string[] {
  const ancestors: string[] = [];
  let currentId = messageId;

  while (currentId) {
    const message = history[currentId];
    if (!message || !message.parentId) break;

    ancestors.unshift(message.parentId);
    currentId = message.parentId;
  }

  return ancestors;
}

/**
 * 메시지 삭제 (자식을 조부모에 연결)
 */
export function deleteMessageNode(
  history: MessageHistory,
  messageId: string
): MessageHistory {
  const newHistory = { ...history };
  const message = newHistory[messageId];

  if (!message) return newHistory;

  // 부모 메시지에서 이 메시지를 제거하고 자식들을 추가
  if (message.parentId) {
    const parent = newHistory[message.parentId];
    if (parent) {
      parent.childrenIds = parent.childrenIds
        .filter((id) => id !== messageId)
        .concat(message.childrenIds);
    }
  }

  // 자식 메시지들의 부모를 조부모로 변경
  message.childrenIds.forEach((childId) => {
    const child = newHistory[childId];
    if (child) {
      child.parentId = message.parentId;
    }
  });

  // 메시지 삭제
  delete newHistory[messageId];

  return newHistory;
}

/**
 * 메시지 추가
 */
export function addMessageNode(
  history: MessageHistory,
  message: Message,
  parentId?: string | null
): MessageHistory {
  const newHistory = { ...history };

  // 부모 메시지의 자식 목록에 추가
  if (parentId && newHistory[parentId]) {
    const parent = newHistory[parentId];
    parent.childrenIds = [...parent.childrenIds, message.id];
  }

  newHistory[message.id] = {
    ...message,
    parentId: parentId || null,
  };

  return newHistory;
}
