// Define the structure of data sent back to the client when responding with user information.
// This Data Transfer Object (DTO) ensures that sensitive information is excluded
// and only relevant fields are shared.

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  birthday: string; // ISO string for de response
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
