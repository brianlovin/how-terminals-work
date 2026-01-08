import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';

// SVG icon components that simulate Nerd Font glyphs
const Icons = {
  folder: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
  ),
  folderOpen: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    </svg>
  ),
  file: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
  ),
  typescript: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M3 3h18v18H3V3zm10.71 14.29v-2.11c.33.28.72.5 1.17.67.45.17.91.25 1.38.25.33 0 .6-.04.82-.12.22-.08.39-.18.52-.3.13-.13.22-.27.28-.43.06-.16.09-.33.09-.5 0-.25-.06-.47-.18-.66-.12-.19-.28-.36-.48-.51-.2-.15-.43-.29-.7-.42-.26-.13-.54-.27-.83-.4-.41-.19-.78-.39-1.11-.6-.33-.21-.61-.45-.85-.71-.24-.26-.42-.56-.55-.89-.13-.33-.19-.71-.19-1.13 0-.52.1-.98.3-1.38.2-.4.47-.73.81-1 .34-.27.74-.48 1.2-.62.46-.14.95-.21 1.47-.21.58 0 1.07.06 1.47.17.4.11.72.24.96.38v2.02c-.14-.11-.32-.22-.52-.32-.2-.1-.42-.19-.65-.26-.23-.07-.47-.13-.71-.17-.24-.04-.47-.06-.69-.06-.29 0-.54.03-.75.09-.21.06-.39.14-.53.24-.14.1-.25.22-.32.36-.07.14-.11.29-.11.45 0 .22.05.41.14.58.09.17.23.32.41.46.18.14.4.27.66.39.26.12.56.25.9.38.44.18.84.38 1.2.59.36.21.67.45.93.72.26.27.46.58.6.92.14.34.21.74.21 1.19 0 .55-.1 1.03-.31 1.44-.21.41-.49.75-.86 1.02-.37.27-.8.47-1.31.61-.51.14-1.07.21-1.68.21-.19 0-.42-.02-.69-.05-.27-.03-.55-.08-.83-.15-.28-.07-.56-.16-.82-.26-.26-.1-.49-.22-.68-.35zM14 9h-2v8h-2V9H8V7h6v2z" />
    </svg>
  ),
  react: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M12 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-11C7.03 2.5 3 5.75 3 9.5c0 1.84.82 3.54 2.17 4.86-.21.6-.37 1.22-.46 1.86-.22 1.62.02 3.03.71 3.9.55.69 1.36 1.03 2.4 1.03.86 0 1.83-.28 2.9-.84.36.06.71.09 1.06.09h.44c.35 0 .7-.03 1.06-.09 1.07.56 2.04.84 2.9.84 1.04 0 1.85-.34 2.4-1.03.69-.87.93-2.28.71-3.9-.09-.64-.25-1.26-.46-1.86C20.18 13.04 21 11.34 21 9.5c0-3.75-4.03-7-9-7zm6.26 11.08c.13.47.22.93.28 1.37.15 1.11-.02 1.98-.36 2.4-.2.25-.5.37-.9.37-.55 0-1.24-.22-2.05-.67-.3.08-.61.14-.93.18-.16.02-.32.03-.48.04h-.64c-.16-.01-.32-.02-.48-.04-.32-.04-.63-.1-.93-.18-.81.45-1.5.67-2.05.67-.4 0-.7-.12-.9-.37-.34-.42-.51-1.29-.36-2.4.06-.44.15-.9.28-1.37-1.02-1.04-1.6-2.25-1.6-3.58 0-2.88 3.24-5.5 7.22-5.5s7.22 2.62 7.22 5.5c0 1.33-.58 2.54-1.6 3.58z" />
    </svg>
  ),
  javascript: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M3 3h18v18H3V3zm4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7v5.74c0 .86-.35 1.08-.91 1.08-.58 0-.82-.4-1.09-.87l-1.37.83zm5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.98-1.32-1.35-2.4-1.35-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.79z" />
    </svg>
  ),
  json: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2zm14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2zm-7 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  ),
  git: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M2.6 10.59L8.38 4.8l1.69 1.7c-.24.85.01 1.78.68 2.44.67.67 1.59.91 2.44.68l1.68 1.68c-.45.97-.26 2.17.57 3 1.02 1.02 2.68 1.02 3.7 0 1.02-1.02 1.02-2.68 0-3.7-.83-.83-2.03-1.02-3-.57l-1.68-1.68c.23-.86 0-1.78-.68-2.44-.68-.67-1.6-.91-2.45-.68L9.67 4.27l.81-.81a2.12 2.12 0 0 1 3 0l6.73 6.73a2.12 2.12 0 0 1 0 3l-6.73 6.73a2.12 2.12 0 0 1-3 0l-6.73-6.73a2.12 2.12 0 0 1 0-3z" />
    </svg>
  ),
  markdown: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41zM6.81 15.19v-3.66l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.88v6.38h1.93zm10.3 0l-2.88-3.2h1.92V8.81h1.92v3.18h1.92l-2.88 3.2z" />
    </svg>
  ),
  docker: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M13.98 11.08h2.12v1.94h-2.12v-1.94zm-2.66 0h2.12v1.94h-2.12v-1.94zm-2.66 0h2.12v1.94H8.66v-1.94zm-2.66 0h2.12v1.94H6v-1.94zm2.66-2.2h2.12v1.94H8.66V8.88zm2.66 0h2.12v1.94h-2.12V8.88zm2.66 0h2.12v1.94h-2.12V8.88zm-2.66-2.2h2.12v1.94h-2.12V6.68zm2.66 0h2.12v1.94h-2.12V6.68zM22 12.26c-.43-.32-1.41-.51-2.18-.32-.1-.72-.48-1.35-1.17-1.92l-.4-.28-.3.38c-.38.48-.58 1.14-.52 1.78.02.23.09.65.31 1.02-.22.12-.66.29-1.23.28H2.06c-.25 1.18-.06 2.73.6 3.81.66 1.08 1.74 1.86 3.26 2.13.6.1 1.26.16 1.97.16 1.86 0 3.54-.38 5.01-1.15.43-.23.82-.48 1.18-.75 1.1-.85 1.79-1.87 2.28-2.73h.2c1.26 0 2.03-.5 2.46-.92.29-.28.52-.61.72-.97l.1-.2-.26-.16z" />
    </svg>
  ),
  terminal: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-9-7l-3 3 3 3 1-1-2-2 2-2-1-1zm6 0l-1 1 2 2-2 2 1 1 3-3-3-3z" />
    </svg>
  ),
  gear: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  ),
  lock: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  check: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  error: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  warning: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  info: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  github: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  python: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
    </svg>
  ),
  rust: (color: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
      <path d="M23.687 11.709l-.995-.612a13.559 13.559 0 0 0-.028-.299l.856-.792a.392.392 0 0 0-.104-.629l-1.054-.484a8.296 8.296 0 0 0-.086-.291l.7-.952a.392.392 0 0 0-.212-.593l-1.137-.322a8.57 8.57 0 0 0-.143-.279l.522-1.087a.392.392 0 0 0-.312-.542l-1.159-.107a7.321 7.321 0 0 0-.188-.253l.331-1.194a.392.392 0 0 0-.402-.477l-1.16.105c-.07-.077-.14-.152-.212-.225l.133-1.267a.392.392 0 0 0-.478-.396l-1.13.318c-.08-.067-.159-.132-.24-.195l-.067-1.305a.392.392 0 0 0-.543-.335l-1.069.527c-.089-.054-.177-.107-.268-.158l-.26-1.306a.392.392 0 0 0-.593-.252l-.978.73a9.316 9.316 0 0 0-.288-.114l-.445-1.255a.392.392 0 0 0-.62-.161l-.859.928a8.944 8.944 0 0 0-.3-.066l-.612-.995a.392.392 0 0 0-.629.003l-.599 1.005a8.944 8.944 0 0 0-.299.028l-.792-.856a.392.392 0 0 0-.629.104l-.484 1.054a8.296 8.296 0 0 0-.291.086l-.952-.7a.392.392 0 0 0-.593.212l-.322 1.137a8.57 8.57 0 0 0-.279.143l-1.087-.522a.392.392 0 0 0-.542.312l-.107 1.159a7.321 7.321 0 0 0-.253.188l-1.194-.331a.392.392 0 0 0-.477.402l.105 1.16c-.077.07-.152.14-.225.212l-1.267-.133a.392.392 0 0 0-.396.478l.318 1.13c-.067.08-.132.159-.195.24l-1.305.067a.392.392 0 0 0-.335.543l.527 1.069c-.054.089-.107.177-.158.268l-1.306.26a.392.392 0 0 0-.252.593l.73.978a9.316 9.316 0 0 0-.114.288l-1.255.445a.392.392 0 0 0-.161.62l.928.859a8.944 8.944 0 0 0-.066.3l-.995.612a.392.392 0 0 0 .003.629l1.005.599c.008.1.017.2.028.299l-.856.792a.392.392 0 0 0 .104.629l1.054.484c.027.098.056.195.086.291l-.7.952a.392.392 0 0 0 .212.593l1.137.322c.046.094.094.187.143.279l-.522 1.087a.392.392 0 0 0 .312.542l1.159.107c.061.086.124.17.188.253l-.331 1.194a.392.392 0 0 0 .402.477l1.16-.105c.07.077.14.152.212.225l-.133 1.267a.392.392 0 0 0 .478.396l1.13-.318c.08.067.159.132.24.195l.067 1.305a.392.392 0 0 0 .543.335l1.069-.527c.089.054.177.107.268.158l.26 1.306a.392.392 0 0 0 .593.252l.978-.73c.094.041.19.078.288.114l.445 1.255a.392.392 0 0 0 .62.161l.859-.928c.099.024.199.046.3.066l.612.995a.392.392 0 0 0 .629-.003l.599-1.005c.1-.008.2-.017.299-.028l.792.856a.392.392 0 0 0 .629-.104l.484-1.054c.098-.027.195-.056.291-.086l.952.7a.392.392 0 0 0 .593-.212l.322-1.137c.094-.046.187-.094.279-.143l1.087.522a.392.392 0 0 0 .542-.312l.107-1.159c.086-.061.17-.124.253-.188l1.194.331a.392.392 0 0 0 .477-.402l-.105-1.16c.077-.07.152-.14.225-.212l1.267.133a.392.392 0 0 0 .396-.478l-.318-1.13c.067-.08.132-.159.195-.24l1.305-.067a.392.392 0 0 0 .335-.543l-.527-1.069c.054-.089.107-.177.158-.268l1.306-.26a.392.392 0 0 0 .252-.593l-.73-.978c.041-.094.078-.19.114-.288l1.255-.445a.392.392 0 0 0 .161-.62l-.928-.859c.024-.099.046-.199.066-.3l.995-.612a.392.392 0 0 0-.003-.629zm-6.838 8.894c-.238 0-.467.037-.682.107a3.82 3.82 0 0 1-.508-.187 3.09 3.09 0 0 1 .089-.543 3.082 3.082 0 0 1 1.101.623zm-6.842-.282a3.087 3.087 0 0 1-.883-.733c.035-.074.073-.147.113-.218.045.074.092.146.143.216a3.082 3.082 0 0 1-.627.735zm-.587-11.167a1.424 1.424 0 0 1 2.194 0l.003.003a1.424 1.424 0 0 1 .258 1.443l-.007.018c-.088.219-.22.42-.391.588l-.003.003-1.461 1.358c-.104.097-.249.097-.354 0l-1.461-1.358-.003-.003a1.424 1.424 0 0 1-.133-1.892l.003-.003c.02-.028.042-.054.064-.08zM12 20.107a8.107 8.107 0 1 1 0-16.214 8.107 8.107 0 0 1 0 16.214z" />
    </svg>
  ),
};

// Icon data with SVG references and codepoints
const NERD_FONT_ICONS = [
  {
    icon: 'folder',
    name: 'Folder',
    codepoint: 'U+F07B',
    category: 'Files',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'folderOpen',
    name: 'Folder Open',
    codepoint: 'U+F07C',
    category: 'Files',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'file',
    name: 'File',
    codepoint: 'U+F15B',
    category: 'Files',
    color: 'text-terminal-fg',
  },
  {
    icon: 'typescript',
    name: 'TypeScript',
    codepoint: 'U+E628',
    category: 'Dev',
    color: 'text-terminal-blue',
  },
  {
    icon: 'javascript',
    name: 'JavaScript',
    codepoint: 'U+E781',
    category: 'Dev',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'react',
    name: 'React',
    codepoint: 'U+E7BA',
    category: 'Dev',
    color: 'text-terminal-cyan',
  },
  {
    icon: 'python',
    name: 'Python',
    codepoint: 'U+E73C',
    category: 'Dev',
    color: 'text-terminal-blue',
  },
  {
    icon: 'rust',
    name: 'Rust',
    codepoint: 'U+E7A8',
    category: 'Dev',
    color: 'text-terminal-fg',
  },
  {
    icon: 'git',
    name: 'Git',
    codepoint: 'U+F1D3',
    category: 'Dev',
    color: 'text-terminal-red',
  },
  {
    icon: 'github',
    name: 'GitHub',
    codepoint: 'U+F408',
    category: 'Dev',
    color: 'text-terminal-fg',
  },
  {
    icon: 'docker',
    name: 'Docker',
    codepoint: 'U+F308',
    category: 'Dev',
    color: 'text-terminal-cyan',
  },
  {
    icon: 'terminal',
    name: 'Terminal',
    codepoint: 'U+F489',
    category: 'System',
    color: 'text-terminal-green',
  },
  {
    icon: 'gear',
    name: 'Gear',
    codepoint: 'U+F013',
    category: 'System',
    color: 'text-terminal-dim',
  },
  {
    icon: 'lock',
    name: 'Lock',
    codepoint: 'U+F023',
    category: 'System',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'check',
    name: 'Check',
    codepoint: 'U+F00C',
    category: 'Status',
    color: 'text-terminal-green',
  },
  {
    icon: 'error',
    name: 'Error',
    codepoint: 'U+F00D',
    category: 'Status',
    color: 'text-terminal-red',
  },
  {
    icon: 'warning',
    name: 'Warning',
    codepoint: 'U+F071',
    category: 'Status',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'info',
    name: 'Info',
    codepoint: 'U+F05A',
    category: 'Status',
    color: 'text-terminal-blue',
  },
] as const;

type IconName = keyof typeof Icons;

// File tree structure for the demo
const FILE_TREE: {
  name: string;
  type: 'folder' | 'file';
  icon: IconName;
  color: string;
  indent: number;
  codepoint: string;
}[] = [
  {
    name: 'src',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 0,
    codepoint: 'U+F07B',
  },
  {
    name: 'components',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 1,
    codepoint: 'U+F07B',
  },
  {
    name: 'App.tsx',
    type: 'file',
    icon: 'react',
    color: 'text-terminal-cyan',
    indent: 2,
    codepoint: 'U+E7BA',
  },
  {
    name: 'Button.tsx',
    type: 'file',
    icon: 'react',
    color: 'text-terminal-cyan',
    indent: 2,
    codepoint: 'U+E7BA',
  },
  {
    name: 'utils',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 1,
    codepoint: 'U+F07B',
  },
  {
    name: 'index.ts',
    type: 'file',
    icon: 'typescript',
    color: 'text-terminal-blue',
    indent: 1,
    codepoint: 'U+E628',
  },
  {
    name: 'package.json',
    type: 'file',
    icon: 'json',
    color: 'text-terminal-green',
    indent: 0,
    codepoint: 'U+E60B',
  },
  {
    name: '.gitignore',
    type: 'file',
    icon: 'git',
    color: 'text-terminal-red',
    indent: 0,
    codepoint: 'U+F1D3',
  },
  {
    name: 'README.md',
    type: 'file',
    icon: 'markdown',
    color: 'text-terminal-fg',
    indent: 0,
    codepoint: 'U+E73E',
  },
  {
    name: 'Dockerfile',
    type: 'file',
    icon: 'docker',
    color: 'text-terminal-cyan',
    indent: 0,
    codepoint: 'U+F308',
  },
];

type ExplainerStep = 'what' | 'how' | 'pua' | 'fonts' | 'rendering';

const STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  what: {
    title: 'What Are Terminal Icons?',
    description:
      "Modern terminal apps like file explorers, status bars, and dev tools display icons for files, folders, and status indicators. These aren't images—they're Unicode characters rendered by special fonts.",
  },
  how: {
    title: 'How They Work',
    description:
      'Terminal icons are just regular Unicode characters. The terminal treats them exactly like letters or numbers—one character per cell. The magic is in the font, which maps these codepoints to icon glyphs.',
  },
  pua: {
    title: 'The Private Use Area',
    description:
      'Unicode reserves ranges (U+E000-U+F8FF) called Private Use Areas. Nerd Fonts place thousands of icons here—dev logos, file types, git symbols, and more. Apps output these codepoints; fonts render them as icons.',
  },
  fonts: {
    title: 'Nerd Fonts',
    description:
      'Nerd Fonts are regular programming fonts (like JetBrains Mono or Fira Code) patched with 3,600+ icons. Install one, set it as your terminal font, and icons just work. No terminal configuration needed.',
  },
  rendering: {
    title: 'The Rendering Pipeline',
    description:
      'When an app outputs an icon: 1) It prints a Unicode character (e.g., U+E628 for TypeScript). 2) The terminal looks up the character in its font. 3) The font maps U+E628 to a TypeScript logo glyph. 4) The terminal draws that glyph in a cell.',
  },
};

export function IconsDemo() {
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('what');
  const [selectedIcon, setSelectedIcon] = useState(NERD_FONT_ICONS[0]);
  const [showWithIcons, setShowWithIcons] = useState(true);
  const [hoveredFile, setHoveredFile] = useState<number | null>(null);

  const steps = Object.keys(STEPS) as ExplainerStep[];
  const currentStepIndex = steps.indexOf(currentStep);
  const stepContent = STEPS[currentStep];

  const categories = [...new Set(NERD_FONT_ICONS.map((i) => i.category))];

  const renderIcon = (iconName: IconName, color: string) => {
    const IconFn = Icons[iconName];
    return IconFn ? IconFn(color) : null;
  };

  return (
    <div className="space-y-8">
      {/* Main Demo */}
      <div className="grid grid-cols-1 gap-6">
        {/* File Explorer Demo */}
        <div className="space-y-4">
          <TerminalWindow>
            <div className="font-mono text-sm min-h-[280px]">
              {/* Toggle */}
              <div className="flex items-center gap-4 mb-3 pb-2 border-b border-terminal-border">
                <button
                  onClick={() => setShowWithIcons(!showWithIcons)}
                  className={`px-2 py-1 text-xs transition-colors ${
                    showWithIcons
                      ? 'bg-terminal-green/20 text-terminal-green'
                      : 'text-terminal-dim hover:text-terminal-fg'
                  }`}
                >
                  {showWithIcons ? 'Icons ON' : 'Icons OFF'}
                </button>
                <span className="text-terminal-dim text-xs">
                  {showWithIcons
                    ? 'Simulating Nerd Font glyphs'
                    : 'Plain text only'}
                </span>
              </div>

              {/* File tree */}
              <div className="space-y-0.5">
                {FILE_TREE.map((item, idx) => {
                  const isHovered = hoveredFile === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        isHovered
                          ? 'bg-terminal-green/20'
                          : 'hover:bg-terminal-border/50'
                      }`}
                      style={{ paddingLeft: `${item.indent * 16 + 8}px` }}
                      onMouseEnter={() => setHoveredFile(idx)}
                      onMouseLeave={() => setHoveredFile(null)}
                    >
                      {showWithIcons ? (
                        <span className="flex-shrink-0">
                          {renderIcon(item.icon, item.color)}
                        </span>
                      ) : (
                        <span className="text-terminal-dim w-4 text-center">
                          {item.type === 'folder' ? 'D' : 'F'}
                        </span>
                      )}
                      <span
                        className={
                          isHovered ? 'text-terminal-green' : 'text-terminal-fg'
                        }
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hovered file info */}
              {hoveredFile !== null && (
                <div className="absolute bottom-4 right-4 border bg-terminal-highlight border-terminal-border text-xs">
                  <div className="flex items-center gap-4 bg-terminal-highlight rounded p-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-terminal-bg rounded border border-terminal-border">
                      {renderIcon(
                        FILE_TREE[hoveredFile].icon,
                        FILE_TREE[hoveredFile].color
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-terminal-fg">
                        <span className="text-terminal-cyan">
                          {FILE_TREE[hoveredFile].name}
                        </span>
                      </div>
                      <div className="text-terminal-yellow font-mono">
                        {FILE_TREE[hoveredFile].codepoint}
                      </div>
                    </div>
                    <div className="text-terminal-dim text-right">
                      One character
                      <br />
                      One cell
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>

        {/* Explanation */}
        <div className="space-y-4">
          <div className="bg-terminal-highlight border border-terminal-border px-4 py-4 space-y-4">
            <div className="h-[180px] overflow-hidden space-y-4">
              <div className="text-terminal-red font-medium text-sm">
                {stepContent.title}
              </div>
              <p className="text-terminal-muted text-sm leading-relaxed">
                {stepContent.description}
              </p>

              {/* Step-specific content */}
              {currentStep === 'pua' && (
                <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                  <div className="text-terminal-dim">
                    // Unicode Private Use Area ranges
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-terminal-cyan">
                        U+E000 - U+F8FF
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Basic Multilingual Plane PUA
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-cyan">
                        U+F0000 - U+FFFFD
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Supplementary PUA-A
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-cyan">
                        U+100000 - U+10FFFD
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Supplementary PUA-B
                      </span>
                    </div>
                  </div>
                  <div className="text-terminal-yellow mt-2">
                    Nerd Fonts uses ~3,600 codepoints in these ranges
                  </div>
                </div>
              )}

              {currentStep === 'rendering' && (
                <div className="bg-terminal-highlight p-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        App outputs
                      </span>
                      <span className="text-terminal-yellow font-mono">
                        U+E628
                      </span>
                    </div>
                    <span className="text-terminal-dim">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        Font lookup
                      </span>
                      <span className="text-terminal-green">Nerd Font</span>
                    </div>
                    <span className="text-terminal-dim">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        Rendered
                      </span>
                      <div className="w-6 h-6">
                        {renderIcon('typescript', 'text-terminal-blue')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'fonts' && (
                <div className="bg-terminal-highlight p-3 text-xs space-y-2">
                  <div className="text-terminal-dim">Popular Nerd Fonts:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>JetBrainsMono Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>FiraCode Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>Hack Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>CaskaydiaCove Nerd Font</span>
                    </div>
                  </div>
                  <div className="text-terminal-cyan mt-2">
                    Download: nerdfonts.com
                  </div>
                </div>
              )}
            </div>

            {/* Step navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-terminal-border">
              <button
                onClick={() =>
                  setCurrentStep(steps[Math.max(0, currentStepIndex - 1)]!)
                }
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {steps.map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-terminal-fg scale-125'
                        : 'bg-terminal-border hover:bg-terminal-dim'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentStep(
                    steps[Math.min(steps.length - 1, currentStepIndex + 1)]!
                  )
                }
                disabled={currentStepIndex === steps.length - 1}
                className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Gallery */}
      <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          Nerd Font Icon Gallery
        </h3>
        <p className="text-terminal-dim text-sm">
          Click any icon to see its Unicode codepoint and how to use it in code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Icon grid by category */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <div className="text-terminal-dim text-xs uppercase tracking-wide">
                  {category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {NERD_FONT_ICONS.filter((i) => i.category === category).map(
                    (item) => (
                      <button
                        key={item.codepoint}
                        onClick={() => setSelectedIcon(item)}
                        className={`w-10 h-10 flex items-center justify-center border transition-all ${
                          selectedIcon.codepoint === item.codepoint
                            ? 'border-terminal-green bg-terminal-green/20 scale-110'
                            : 'border-terminal-border hover:border-terminal-dim'
                        }`}
                        title={item.name}
                      >
                        {renderIcon(item.icon as IconName, item.color)}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected icon details */}
          <div className="bg-terminal-highlight p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-terminal-bg border border-terminal-border">
                <div className="w-8 h-8 flex items-center justify-center">
                  {renderIcon(
                    selectedIcon.icon as IconName,
                    selectedIcon.color
                  )}
                </div>
              </div>
              <div>
                <div className="text-terminal-fg font-bold">
                  {selectedIcon.name}
                </div>
                <div className="text-terminal-cyan font-mono text-sm">
                  {selectedIcon.codepoint}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-terminal-bg p-3 font-mono text-xs">
                <div className="text-terminal-dim mb-1">
                  // In shell (with Nerd Font)
                </div>
                <div className="text-terminal-green">
                  echo -e "\u
                  {selectedIcon.codepoint.replace('U+', '').toLowerCase()}{' '}
                  {selectedIcon.name}"
                </div>
              </div>

              <div className="bg-terminal-bg p-3 font-mono text-xs">
                <div className="text-terminal-dim mb-1">
                  // In code (escape sequence)
                </div>
                <div>
                  <span className="text-terminal-magenta">printf</span>
                  <span className="text-terminal-yellow">(</span>
                  <span className="text-terminal-green">
                    "\\u{selectedIcon.codepoint.replace('U+', '').toLowerCase()}
                    "
                  </span>
                  <span className="text-terminal-yellow">)</span>
                </div>
              </div>

              <div className="bg-terminal-bg p-3 font-mono text-xs">
                <div className="text-terminal-dim mb-1">// Character info</div>
                <div className="text-terminal-fg">
                  Codepoint:{' '}
                  <span className="text-terminal-cyan">
                    {selectedIcon.codepoint}
                  </span>
                </div>
                <div className="text-terminal-fg">
                  Decimal:{' '}
                  <span className="text-terminal-cyan">
                    {parseInt(selectedIcon.codepoint.replace('U+', ''), 16)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          Under the Hood: Why One Cell?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-fg font-bold">
              <span>1</span>
              <span>Single Codepoint</span>
            </div>
            <p className="text-sm text-terminal-dim">
              Each Nerd Font icon is a single Unicode codepoint. The terminal
              sees it as one character, just like 'A' or '中'. One character =
              one cell.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-fg font-bold">
              <span>2</span>
              <span>Font Glyphs</span>
            </div>
            <p className="text-sm text-terminal-dim">
              The font file contains a glyph (vector drawing) for each
              codepoint. Nerd Fonts add thousands of icon glyphs sized to fit
              the terminal's cell dimensions.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-fg font-bold">
              <span>3</span>
              <span>Cell-Sized Design</span>
            </div>
            <p className="text-sm text-terminal-dim">
              Icon glyphs are designed to fit within a monospace cell. They're
              square or slightly rectangular to match the terminal's character
              grid perfectly.
            </p>
          </div>
        </div>

        {/* Character width comparison */}
        <div className="bg-terminal-highlight border border-terminal-border p-4 space-y-3">
          <div className="text-terminal-red text-sm font-bold">
            Character Width in Terminals
          </div>
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-24 text-terminal-dim">Single-width:</div>
              <div className="flex">
                {['A', 'B', 'C'].map((char, i) => (
                  <div
                    key={i}
                    className="w-5 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                  >
                    {char}
                  </div>
                ))}
                {[Icons.folder, Icons.file, Icons.check].map((IconFn, i) => (
                  <div
                    key={`icon-${i}`}
                    className="w-5 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                  >
                    <div className="w-3 h-3">{IconFn('text-terminal-fg')}</div>
                  </div>
                ))}
              </div>
              <span className="text-terminal-dim text-xs">1 cell each</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-terminal-dim">Double-width:</div>
              <div className="flex">
                {['中', '文', '字'].map((char, i) => (
                  <div
                    key={i}
                    className="w-10 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <span className="text-terminal-dim text-xs">
                2 cells each (CJK)
              </span>
            </div>
          </div>
          <p className="text-terminal-dim text-xs">
            Nerd Font icons are single-width characters. CJK characters and some
            emoji are double-width.
          </p>
        </div>
      </div>

      {/* Common Icon Sets Reference */}
      <IconSetsReference />
    </div>
  );
}

function IconSetsReference() {
  const iconSets = [
    {
      name: 'Powerline',
      description: 'Status bar separators and arrows',
      range: 'U+E0A0-E0D4',
      icons: [
        {
          render: (c: string) => (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 ${c}`}
            >
              <path d="M0 0l12 12L0 24V0z" />
            </svg>
          ),
        },
        {
          render: (c: string) => (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 ${c}`}
            >
              <path d="M12 0l12 12-12 12V0z" />
            </svg>
          ),
        },
        {
          render: (c: string) => (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 ${c}`}
            >
              <path d="M24 0L12 12l12 12V0z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Font Awesome',
      description: 'General purpose icons',
      range: 'U+F000-F2E0',
      icons: [
        { render: Icons.folder },
        { render: Icons.file },
        { render: Icons.gear },
        { render: Icons.lock },
      ],
    },
    {
      name: 'Devicons',
      description: 'Programming language logos',
      range: 'U+E700-E7C5',
      icons: [
        { render: Icons.typescript },
        { render: Icons.javascript },
        { render: Icons.react },
        { render: Icons.python },
        { render: Icons.rust },
      ],
    },
    {
      name: 'Octicons',
      description: 'GitHub-style icons',
      range: 'U+F400-F532',
      icons: [
        { render: Icons.github },
        { render: Icons.git },
        { render: Icons.terminal },
      ],
    },
  ];

  return (
    <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-4">
      <h3 className="text-terminal-red text-sm font-bold">
        Icon Sets in Nerd Fonts
      </h3>
      <p className="text-terminal-dim text-sm">
        Nerd Fonts combines multiple icon sets into one font. Each set occupies
        a different Unicode range.
      </p>

      <div className="space-y-3">
        {iconSets.map((set) => (
          <div
            key={set.name}
            className="flex flex-col md:flex-row md:items-center gap-3 bg-terminal-highlight p-3"
          >
            <div className="md:w-32">
              <div className="text-terminal-fg font-bold text-sm">
                {set.name}
              </div>
              <div className="text-terminal-cyan font-mono text-xs">
                {set.range}
              </div>
            </div>
            <div className="text-terminal-dim text-xs flex-1">
              {set.description}
            </div>
            <div className="flex gap-3">
              {set.icons.map((icon, i) => (
                <span key={i}>{icon.render('text-terminal-fg')}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
