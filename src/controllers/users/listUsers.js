import { listUsersService } from "../../services/users/index.js";

export default async function listUsers(request, response) {
  const users = listUsersService();
  response.status(200).json(users);
}
