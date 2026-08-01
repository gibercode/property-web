import type { LoaderFunctionArgs } from "react-router";
import { useUserStore } from "../store/user-store";
import type { UsersFilters, UsersLoaderData } from "../types/users";
import { requireAuthToken } from "../utils/auth-utils";

const normalizeOrderBy = (value: string | null): UsersFilters["orderBy"] => {
  if (value === "email" || value === "activo") {
    return value;
  }

  return "nombre";
};

const getUsersFilters = (searchParams: URLSearchParams): UsersFilters => ({
  limit: searchParams.get("limit") ?? "10",
  order: searchParams.get("order") === "DESC" ? "DESC" : "ASC",
  orderBy: normalizeOrderBy(searchParams.get("orderBy")),
  page: searchParams.get("page") ?? "1",
  search: searchParams.get("search") ?? "",
});

export async function usersLoader({
  request,
}: LoaderFunctionArgs): Promise<UsersLoaderData> {
  const accessToken = requireAuthToken();
  const url = new URL(request.url);
  const filters = getUsersFilters(url.searchParams);
  const users = await useUserStore.getState().getUsers(filters, accessToken);

  return {
    filters,
    users,
  };
}
