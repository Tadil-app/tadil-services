# Chat Core Library

## Overview
`tadil-chat` provides the core logic and repository interfaces for the real-time communication system between customers and service providers.

## Key Features
- **Channel Support**: Dedicated channels for `TAILOR` and `COURIER` communication per order.
- **Message Types**: Supports `TEXT`, `IMAGE`, and `AUDIO` messages.
- **Persistence**: Messages are stored in a structured JSONB array within the `Chat` model for high-performance retrieval and flexibility.

## Core Models
### ChatMessage
```typescript
{
  id: string;
  senderId: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO';
  content: string; // Text or file URL
  timestamp: string;
  metadata?: any;
}
```

## Logic
- `SendMessageUseCase`: Handles the validation and saving of new messages.
- `ChatRepository`: Interface for database interactions, ensuring all messages for a specific order and channel are grouped and persisted correctly.

## Location
`libs/core/tadil-chat`
