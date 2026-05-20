# API Rules

- All API responses must use response helper.
- Use consistent response format:
  {
  success,
  message,
  data
  }

- Validate all inputs using Zod.
- Never trust client input.
- Handle errors gracefully.
