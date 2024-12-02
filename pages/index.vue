<template>
  <div>
    <h1>채팅방</h1>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        {{ msg }}
      </div>
    </div>
    <input
      v-model="newMessage"
      type="text"
      placeholder="메시지를 입력하세요"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">전송</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 상태 변수
const messages = ref<string[]>([]);
const newMessage = ref<string>('');

// WebSocket 연결 변수
let socket: WebSocket | null = null;

// 로컬 저장소에서 메시지 로드
function loadMessagesFromLocalStorage() {
  const storedMessages = localStorage.getItem('chatMessages');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
}

// 로컬 저장소에 메시지 저장
function saveMessagesToLocalStorage() {
  localStorage.setItem('chatMessages', JSON.stringify(messages.value));
}

// WebSocket 연결 함수
function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3001'); // WebSocket 서버 주소

  // 서버로부터 메시지 수신
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.content) {
        messages.value.push(message.content); // 메시지를 화면에 추가
        saveMessagesToLocalStorage(); // 메시지를 로컬 저장소에 저장
      }
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
    }
  };

  // WebSocket 연결 오류 처리
  socket.onerror = (error) => {
    console.error('WebSocket 에러 발생:', error);
  };

  // WebSocket 연결 종료 처리
  socket.onclose = () => {
    console.warn('WebSocket 연결이 종료되었습니다.');
  };
}

// 메시지 전송 함수
function sendMessage() {
  if (newMessage.value.trim() && socket) {
    try {
      const message = JSON.stringify({ content: newMessage.value });
      socket.send(message); // JSON 형식으로 메시지 전송
      newMessage.value = ''; // 입력 필드 초기화
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  } else {
    console.warn('WebSocket 연결이 없거나 메시지가 비어있습니다.');
  }
}

// 컴포넌트 마운트 및 언마운트 처리
onMounted(() => {
  loadMessagesFromLocalStorage();
  connectWebSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.close(); // WebSocket 연결 종료
  }
});
</script>

<style>
.chat-box {
  border: 1px solid #ddd;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
}
</style>
